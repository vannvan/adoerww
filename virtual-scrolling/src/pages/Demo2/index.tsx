import VariableSizeList from "./VariableSizeList";

const rowSizes = new Array(1000).fill(true).map(() => 25 + Math.round(Math.random() * 55))
const getItemSize = (index: number) => rowSizes[index];

const Row = ({ index, style }: any) => {
  return (
    <div className={index % 2 ? 'list-item-odd' : 'list-item-even'} style={style} >
      Row {index}
    </div>
  )
}
const Demo2 = () => {
  return <div style={{ background: "#1abc9c" }}>
    <h2>高度不固定</h2>
    <VariableSizeList
      className="list"
      height={200}
      width={200}
      itemSize={getItemSize}
      itemCount={1000}
    >
      {Row}
    </VariableSizeList>
  </div>

}

export default Demo2