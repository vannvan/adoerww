import FixedSizeList from "./FixedSizeList"

const Row = ({ index, style, forwardRef }: any) => {
  return (
    <div className={index % 2 ? 'list-item-odd' : 'list-item-even'} style={style} ref={forwardRef}>
      {`Row ${index}`}
    </div>
  )
}

const Demo1 = () => {
  return <div style={{ background: '#1abc9c' }}>
    <h2>高度固定</h2>
    <FixedSizeList
      className="list"
      height={200}
      width={200}
      itemSize={50}
      itemCount={1000}
    >
      {Row}
    </FixedSizeList>
  </div>
}

export default Demo1