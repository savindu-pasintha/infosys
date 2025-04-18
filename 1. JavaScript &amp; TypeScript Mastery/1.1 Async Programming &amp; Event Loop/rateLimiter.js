// This class controls how often we can run certain functions —
// it makes sure we don’t run more than 'N' functions in any 1-second window.
class RateLimiter {
  constructor(limitPerSecond) {
    this.limit = limitPerSecond; // Maximum number of allowed function executions per second
    this.timestamps = []; // Keeps track of when recent functions were executed
    this.queue = []; // Holds functions that are waiting for a turn
    this.isRunning = false; // Flag to avoid running multiple queue processors at once
  }

  // This removes timestamps older than 1 second so we only count recent executions
  _cleanupOldTimestamps() {
    const now = Date.now();
    while (this.timestamps.length && now - this.timestamps[0] > 1000) {
      this.timestamps.shift(); // Remove the oldest timestamp if it’s over 1 second old
    }
  }

  /**
   * This schedules a function to run after a given delay.
   * If we're under the limit, we run it after the delay.
   * If we're already at the limit, we put it in the queue to try later.
   */
  async schedule(fn, delay) {
    return new Promise((resolve) => {
      const task = async () => {
        // Wait for the given delay before we even try to run the function
        await new Promise((res) => setTimeout(res, delay));

        this._cleanupOldTimestamps(); // Clean out any old executions

        if (this.timestamps.length < this.limit) {
          // If we haven’t hit the limit, run the function and log the time
          this.timestamps.push(Date.now());
          resolve(fn());
        } else {
          // Otherwise, queue it to try again later
          this.queue.push({ fn, delay, resolve });
        }
      };

      task(); // Start trying to run the task right away
      this._runQueue(); // Also make sure the queue manager is running
    });
  }

  /**
   * This is a background loop that keeps checking the queue.
   * Whenever a spot opens up (we're under the limit), it runs the next task.
   */
  _runQueue() {
    if (this.isRunning) return; // Don’t run the loop twice
    this.isRunning = true;

    const loop = async () => {
      while (this.queue.length > 0) {
        this._cleanupOldTimestamps(); // Always make sure timestamps are up-to-date

        if (this.timestamps.length < this.limit) {
          // If we're allowed to run another function now:
          const { fn, delay, resolve } = this.queue.shift(); // Take the next task
          await new Promise((res) => setTimeout(res, delay)); // Wait its delay again
          this.timestamps.push(Date.now()); // Log this execution
          resolve(fn()); // Run the function
        } else {
          // Still at the limit — wait a little and check again
          await new Promise((res) => setTimeout(res, 100));
        }
      }

      this.isRunning = false; // Done for now — nothing left in the queue
    };

    // Run the loop soon, but not immediately (let current code finish first)
    queueMicrotask(loop);
  }
}


// Create a rate limiter that allows 3 tasks per second
const limiter = new RateLimiter(3);

// This function just logs which task ran and when
function testFn(i) {
  return () => console.log(`Executed task ${i} at ${Date.now()}`);
}

// Try to run 10 tasks, spacing them out a little more each time (100ms more per task)
for (let i = 1; i <= 10; i++) {
  limiter.schedule(testFn(i), 100 * i);
}
