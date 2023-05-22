import VariableSizeList from "./VariableSizeList";

const items: any[] = [];
const itemCount = 1000;
for (let i = 0; i < itemCount; i++) {
  const height = (30 + Math.floor(Math.random() * 30));
  const style = {
    height,
    width: '100%',
  }
  items.push(
    <div className={i % 2 ? 'list-item-odd' : 'list-item-even'} style={style}>Row {i}</div>
  )
}

const Row = ({ index }: any) => items[index];

const Demo3 = () => {
  return (
    <div style={{ background: "#1abc9c" }}>
      <h2>高度动态</h2>
      <VariableSizeList
        className="list"
        height={200}
        width={200}
        itemCount={itemCount}
        isDynamic
      >
        {Row}
      </VariableSizeList>
    </div>
  )
}

export default Demo3