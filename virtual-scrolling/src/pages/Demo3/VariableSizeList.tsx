import React, { useState } from 'react';

// 元数据
const measuredData: any = {
  measuredDataMap: {},
  lastMeasuredItemIndex: -1,
};

const estimatedHeight = (defaultEstimatedItemSize = 50, itemCount: number) => {
  let measuredHeight = 0;
  const { measuredDataMap, lastMeasuredItemIndex } = measuredData;
  // 计算已经获取过真实高度的项的高度之和
  if (lastMeasuredItemIndex >= 0) {
    const lastMeasuredItem = measuredDataMap[lastMeasuredItemIndex];
    measuredHeight = lastMeasuredItem.offset + lastMeasuredItem.size;
  }
  // 未计算过真实高度的项数
  const unMeasuredItemsCount = itemCount - measuredData.lastMeasuredItemIndex - 1;
  // 预测总高度
  const totalEstimatedHeight = measuredHeight + unMeasuredItemsCount * defaultEstimatedItemSize;
  return totalEstimatedHeight;
}

const getItemMetaData = (props: any, index: number) => {
  const { itemSize } = props;
  const { measuredDataMap, lastMeasuredItemIndex } = measuredData;
  // 如果当前索引比已记录的索引要大，说明要计算当前索引的项的size和offset
  if (index > lastMeasuredItemIndex) {
    let offset = 0;
    // 计算当前能计算出来的最大offset值
    if (lastMeasuredItemIndex > 0) {
      const lastMeasuredItem = measuredDataMap[lastMeasuredItemIndex];
      offset += lastMeasuredItem.offset + lastMeasuredItem.size;
    }
    // 计算直到index为止，所有未计算过的项
    for (let i = lastMeasuredItemIndex + 1; i <= index; i++) {
      const currentItemSize = itemSize ? itemSize(i) : 50;
      measuredDataMap[i] = { size: currentItemSize, offset };
      offset += currentItemSize;
    }
    // 更新已计算的项的索引值
    measuredData.lastMeasuredItemIndex = index;
  }
  return measuredDataMap[index];
};

const getStartIndex = (props: any, scrollOffset: number) => {
  let index = 0;
  while (true) {
    const currentOffset = getItemMetaData(props, index).offset;
    if (currentOffset >= scrollOffset) return index;
    index++
  }
}

const getEndIndex = (props: { height: any; }, startIndex: number) => {
  const { height } = props;
  // 获取可视区内开始的项
  const startItem = getItemMetaData(props, startIndex);
  // 可视区内最大的offset值
  const maxOffset = startItem.offset + height;
  // 开始项的下一项的offset，之后不断累加此offset，知道等于或超过最大offset，就是找到结束索引了
  let offset = startItem.offset + startItem.size;
  // 结束索引
  let endIndex = startIndex;
  // 累加offset
  while (offset <= maxOffset) {
    endIndex++;
    const currentItem = getItemMetaData(props, endIndex);
    offset += currentItem.size;
  }
  return endIndex;
};

const getRangeToRender = (props: { itemCount: any; }, scrollOffset: number) => {
  const { itemCount } = props;
  const startIndex = getStartIndex(props, scrollOffset);
  const endIndex = getEndIndex(props, startIndex);
  return [
    Math.max(0, startIndex - 2),
    Math.min(itemCount - 1, endIndex + 2),
    startIndex,
    endIndex,
  ];
};

class ListItem extends React.Component {
  domRef: React.RefObject<any>;
  resizeObserver: any;
  constructor(props: any) {
    super(props);
    this.domRef = React.createRef();
    this.resizeObserver = null;
  }
  componentDidMount() {
    if (this.domRef.current) {
      const domNode = this.domRef.current.firstChild;
      const { index, onSizeChange } = this.props;
      this.resizeObserver = new ResizeObserver(() => {
        onSizeChange(index, domNode);
      });
      this.resizeObserver.observe(domNode);
    }
  }
  componentWillUnmount() {
    if (this.resizeObserver && this.domRef.current.firstChild) {
      this.resizeObserver.unobserve(this.domRef.current.firstChild);
    }
  }
  render() {
    const { index, style, ComponentType } = this.props;
    return (
      <div style={style} ref={this.domRef}>
        <ComponentType index={index} />
      </div>
    )
  }
}

const VariableSizeList = (props: { height: any; width: any; itemCount: any; itemEstimatedSize: any; children: any; }) => {
  const { height, width, itemCount, itemEstimatedSize, children: Child } = props;
  const [scrollOffset, setScrollOffset] = useState(0);
  const [, setState] = useState({});

  const containerStyle = {
    position: 'relative',
    width,
    height,
    overflow: 'auto',
    willChange: 'transform'
  };

  const contentStyle = {
    height: estimatedHeight(itemEstimatedSize, itemCount),
    width: '100%',
  };

  const sizeChangeHandle = (index: string | number, domNode: { offsetHeight: any; }) => {
    const height = domNode.offsetHeight;
    const { measuredDataMap, lastMeasuredItemIndex } = measuredData;
    const itemMetaData = measuredDataMap[index];
    itemMetaData.size = height;
    let offset = 0;
    for (let i = 0; i <= lastMeasuredItemIndex; i++) {
      const itemMetaData = measuredDataMap[i];
      itemMetaData.offset = offset;
      offset += itemMetaData.size;
    }
    setState({});
  }

  const getCurrentChildren = () => {
    const [startIndex, endIndex] = getRangeToRender(props, scrollOffset)
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const item = getItemMetaData(props, i);
      const itemStyle = {
        position: 'absolute',
        height: item.size,
        width: '100%',
        top: item.offset,
      };
      items.push(
        <ListItem key={i} index={i} style={itemStyle} ComponentType={Child} onSizeChange={sizeChangeHandle} />
      );
    }
    return items;
  }

  const scrollHandle = (event: { currentTarget: { scrollTop: any; }; }) => {
    const { scrollTop } = event.currentTarget;
    setScrollOffset(scrollTop);
  }

  return (
    <div style={{ background: "#3498db" }}>
      <div style={containerStyle} onScroll={scrollHandle}>
        <div style={contentStyle}>
          {getCurrentChildren()}
        </div>
      </div>
    </div>

  );
};

export default VariableSizeList;
