/*
 * @Author: dengyongqing@aliyun.com 
 * @Date: 2018-11-22 17:40:35 
 * @Last Modified by:   dengyongqing@aliyun.com 
 * @Last Modified time: 2018-11-22 17:40:35 
 */


import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import utils from './utils';

export default class Sticky extends Component {
    static propTypes = {
        stickyExtraClass: PropTypes.string,
        children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string])
    };

    static defaultProps = {
        stickyExtraClass: ''
    };

    static contextTypes = {
        scroller: PropTypes.object
    };

    constructor() {
        super();
        this.domNode = null;
        this.height = null;
        this.offsetTop = null;
        this.className = null;
    }

    componentDidMount() {
        this.scroller = this.context.scroller;

        if (this.scroller) {
            this.initialize();
            this.scroller.stickyHeaders.push(this);
        }
    }

    componentDidUpdate() {
        this.initialize();
    }

    componentWillUnmount() {
        if (this.scroller) {
            this.scroller.stickyHeaders =
                this.scroller.stickyHeaders.filter((header) => header !== this);
        }
    }

    initialize() {
        this.domNode = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
        this.height = this.domNode.offsetHeight;
        this.offsetTop = -utils.offset(this.domNode).top;
        this.className = this.domNode.className;
        this.onlyChild = React.Children.only(this.props.children);
        this.stickyExtraClass = this.props.stickyExtraClass;
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
