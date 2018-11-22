import * as React from 'react';

export interface Props {
  size?: number | string;
  style?: object;
  color?: string;
  className?: string;
};

export default class Loading extends React.PureComponent<Props, any> {
  render() {
    const { className } = this.props;
    const style = getStyle(this.props);
    return (
      <ReactSVG
    path="loading.svg"
    callback={svg => console.log(svg)}
    className="example"
  />,
    );
  }
}

function getStyle(props) {
  const { size = 40, color = '#20a0ff' } = props;

  return Object.assign({
    width: size,
    height: size,
    animation: 'rotate 2s linear infinite',

    circle: {
      stroke: color,
      animation: 'dash 1.5s ease-in-out infinite',
    },
  }, props.style);
}
