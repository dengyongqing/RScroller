/*
 * @Author: dengyongqing@aliyun.com 
 * @Date: 2018-11-22 17:39:08 
 * @Last Modified by:   dengyongqing@aliyun.com 
 * @Last Modified time: 2018-11-22 17:39:08 
 */

import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { DashLoading } from 'elfen-component-spinner';
import debounce from 'lodash.debounce';

const Container = styled.div`
  padding: 1rem 1.6rem 0px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3.5px;
  }
`;

const Scroller = styled.div`

`;

const LoadingWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 1rem;
`;

export default class ScrollerPC extends PureComponent {
  threshold = 100;
  lastScrollTop = 0;

  state = {
    loading: false,
  };

  componentDidMount() {
    if (!this.node) {
      this.node =  document.querySelector('#scroll-node');
    }
  
    this.node.scrollTop = this.node.scrollHeight;
    this.node.addEventListener('scroll', event => {
      this.onScrollTop(event);
    }, { passive: true });
  }

  componentWillReceiveProps(nextProps) {
    if (React.Children.count(this.props.children) !== React.Children.count(nextProps.children) && this.props.pageNum === nextProps.pageNum) {
      if (!this.node) {
        this.node =  document.querySelector('#scroll-node');
      }
      
      setTimeout(() => {
        if (!this.node.scrollTo) {
          this.node.scrollTo = ({ top = 0, behavior = 'instant'}) => {
            this.node.scrollTop = top;
          }
        }
        this.node.scrollTo({
          top: this.node.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }

  onScrollTop = debounce((event) => {
    if (this.state.loading) return false;

    const { offsetHeight, scrollTop, scrollHeight } = event.target;
    this.direction = scrollTop - this.lastScrollTop >= 0 ? 'down' : 'up';
    if (scrollTop - this.lastScrollTop >= 0) {
      this.lastScrollTop = scrollTop;
      return false;
    }

    this.lastScrollTop = scrollTop;
    if (scrollTop < this.threshold) {
      this.setState({ loading: true });

      const it = setTimeout(() => {
        this.props.pullRefreshAction(
          () => this.setState({ loading: false }),
          () => this.setState({ loading: false }),
        );
        clearTimeout(it);
      }, 1000);
    }
  }, 250)

  getNode = (ref) => {
    this.node = ref;
  }

  render() {
    const { children } = this.props;
    const { loading } = this.state;

    return (
      <Container innerRef={this.getNode} id="scroll-node">
        <Scroller>
          {loading ? (
            <LoadingWrapper>
              <DashLoading size="20" duration="1.0" color="rgba(179, 179, 179, 0.38)" strokeWidth="1" />
            </LoadingWrapper>
          ) : null}
          {children}
        </Scroller>
      </Container>
    );
  }
}