import { h, Fragment, render, mount } from 'lithent';
import { state, computed } from 'lithent/helper';

const Component = mount(r => {
  const count = state<number>(1, r);
  const increase = () => {
    count.v += 1;
  };

  // const result = computed<number>(() =>
  //   [1, 3, 5, 7, 9].reduce(
  //     (accumulator, current) => accumulator + current * count.v,
  //     0
  //   )
  // );

  return () => (
    <>
      <div
        style={{
          textAlign: 'center',
          fontWeight: 600,
          padding: '200px',
          fontSize: '28px',
        }}
      >
        <div style={{ marginBottom: '20px' }}>computed: {count.v}</div>
        <button
          type="text"
          onClick={increase}
          style={{
            background: '#dfe4ea',
            height: '40px',
            padding: '0 30px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          加1
        </button>
      </div>
    </>
  );
});

render(<Component />, document.getElementById('root'));
