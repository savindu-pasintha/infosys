import React, { useCallback } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

type Item = {
  id: number;
  name: string;
};

const generateItems = (count: number): Item[] =>
  Array.from({ length: count }, (_, i) => ({ id: i, name: `Item #${i}` }));

const items = generateItems(10000);

const Row = React.memo(({ index, style, data }: ListChildComponentProps<Item[]>) => {
  const item = data[index];
  return (
    <div style={style}>
      {item.id}: {item.name}
    </div>
  );
});

export default function VirtualizedList() {
  const getRow = useCallback(
    (props: ListChildComponentProps) => <Row {...props} data={items} />,
    []
  );

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <List
        height={500}
        itemCount={items.length}
        itemSize={35}
        width="100%"
        itemData={items}
      >
        {getRow}
      </List>
    </div>
  );
}
