'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rotation = function (_Component) {
  _inherits(Rotation, _Component);

  function Rotation() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Rotation);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Rotation.__proto__ || Object.getPrototypeOf(Rotation)).call.apply(_ref, [this].concat(args))), _this), _this.hovered = false, _this.state = {
      current: 0
    }, _this.hover = function (event) {
      _this.hovered = true;
    }, _this.unhover = function (event) {
      _this.hovered = false;
    }, _this.wheelMove = function (event) {
      event.preventDefault();
      var deltaY = event.deltaY;
      var reverse = _this.props.reverse;
      var current = _this.state.current;

      var delta = deltaY === 0 ? 0 : deltaY / Math.abs(deltaY);
      _this.stop();
      _this.setCurrentFrame(reverse ? current - delta : current + delta);
    }, _this.touchStart = function (event) {
      event.preventDefault();
      _this.pointerPosition = _this.calculatePointerPosition(event);
      _this.startFrame = _this.state.current;
      _this.stop();
    }, _this.touchMove = function (event) {
      var notTouched = typeof _this.pointerPosition !== 'number';
      event.preventDefault();

      if (notTouched) {
        return;
      }

      var _this$props = _this.props,
          vertical = _this$props.vertical,
          children = _this$props.children,
          reverse = _this$props.reverse;
      var _event$currentTarget = event.currentTarget,
          offsetWidth = _event$currentTarget.offsetWidth,
          offsetHeight = _event$currentTarget.offsetHeight;

      var fullRotationWidth = Number.isInteger(_this.props.sizeOfOneFullRotation) ? _this.props.sizeOfOneFullRotation : offsetWidth;
      var fullRotationHeight = Number.isInteger(_this.props.sizeOfOneFullRotation) ? _this.props.sizeOfOneFullRotation : offsetHeight;
      var pointer = _this.calculatePointerPosition(event);
      var max = vertical ? fullRotationHeight : fullRotationWidth;
      var offset = pointer - _this.pointerPosition;
      var delta = Math.floor(offset / max * children.length);
      var adjustedDelta = Math.abs(delta) > children.length ? Math.sign(delta) < 0 ? delta + 60 : delta - 60 : delta;
      _this.setCurrentFrame(reverse ? _this.startFrame - adjustedDelta : _this.startFrame + adjustedDelta);
    }, _this.touchEnd = function (event) {
      event.preventDefault();
      _this.pointerPosition = null;
      _this.startFrame = null;
    }, _this.pressKey = function (event) {
      var eventOnField = event.target.tagName.match('TEXTAREA|INPUT|SELECT');

      if (eventOnField) {
        return;
      }

      var current = _this.state.current;
      var _this$props2 = _this.props,
          vertical = _this$props2.vertical,
          reverse = _this$props2.reverse;

      var prevKey = vertical ? 38 : 37;
      var nextKey = vertical ? 40 : 39;
      _this.stop();

      if (event.keyCode === prevKey) {
        _this.setCurrentFrame(reverse ? current + 1 : current - 1);
      } else if (event.keyCode === nextKey) {
        _this.setCurrentFrame(reverse ? current - 1 : current + 1);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Rotation, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('mouseup', this.touchEnd, false);

      if (this.props.autoPlay) {
        this.nextFrame();
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(_ref2) {
      var autoPlay = _ref2.autoPlay;

      if (autoPlay !== this.props.autoPlay) {
        if (autoPlay) {
          this.nextFrame();
        } else {
          this.stop();
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('mouseup', this.touchEnd, false);
      this.stop();
    }
  }, {
    key: 'setCurrentFrame',
    value: function setCurrentFrame(frame) {
      var _props = this.props,
          cycle = _props.cycle,
          children = _props.children,
          onChange = _props.onChange;

      var length = children.length;
      var current = frame;

      if (current < 0) {
        current = cycle ? current + length : 0;
      }

      if (current > length - 1) {
        current = cycle ? current - length : length - 1;
      }

      if (current !== this.state.current) {
        this.setState({ current: current });
        onChange(current);
      } else if (this.props.autoPlay) {
        this.stop();
      }
    }
  }, {
    key: 'nextFrame',
    value: function nextFrame() {
      var _this2 = this;

      var current = this.state.current;
      var _props2 = this.props,
          reverse = _props2.reverse,
          autoPlay = _props2.autoPlay,
          pauseOnHover = _props2.pauseOnHover;

      var playTimeout = autoPlay === true ? 75 : autoPlay;

      if (!this.hovered || !pauseOnHover) {
        this.setCurrentFrame(reverse ? current - 1 : current + 1);
      }

      this.nextTimeout = setTimeout(function () {
        _this2.nextFrame();
      }, playTimeout);
    }
  }, {
    key: 'stop',
    value: function stop() {
      clearTimeout(this.nextTimeout);
    }
  }, {
    key: 'calculatePointerPosition',
    value: function calculatePointerPosition(event) {
      var _ref3 = event.type.indexOf('touch') === 0 ? event.changedTouches[0] : event,
          clientX = _ref3.clientX,
          clientY = _ref3.clientY;

      var _event$currentTarget2 = event.currentTarget,
          offsetTop = _event$currentTarget2.offsetTop,
          offsetLeft = _event$currentTarget2.offsetLeft;

      return this.props.vertical ? clientY - offsetTop : clientX - offsetLeft;
    }
  }, {
    key: 'render',
    value: function render() {
      var current = this.state.current;
      var _props3 = this.props,
          children = _props3.children,
          className = _props3.className,
          tabIndex = _props3.tabIndex,
          scroll = _props3.scroll,
          pauseOnHover = _props3.pauseOnHover;


      return _react2.default.createElement(
        'div',
        {
          tabIndex: tabIndex,
          onTouchStart: this.touchStart,
          onTouchMove: this.touchMove,
          onTouchEnd: this.touchEnd,
          onMouseDown: this.touchStart,
          onMouseMove: this.touchMove,
          onWheel: scroll ? this.wheelMove : null,
          onMouseEnter: pauseOnHover ? this.hover : null,
          onMouseLeave: pauseOnHover ? this.unhover : null,
          onKeyDown: tabIndex >= 0 ? this.pressKey : null,
          className: className,
          style: { position: 'relative' } },
        _react.Children.map(children, function (child, i) {
          return (0, _react.cloneElement)(child, {
            style: {
              width: '100%',
              display: current === i ? 'block' : 'none'
            }
          });
        })
      );
    }
  }]);

  return Rotation;
}(_react.Component);

Rotation.propTypes = {
  className: _propTypes2.default.string,
  cycle: _propTypes2.default.bool,
  scroll: _propTypes2.default.bool,
  vertical: _propTypes2.default.bool,
  reverse: _propTypes2.default.bool,
  autoPlay: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]),
  onChange: _propTypes2.default.func,
  children: _propTypes2.default.arrayOf(_propTypes2.default.element).isRequired,
  tabIndex: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  pauseOnHover: _propTypes2.default.bool,
  sizeOfOneFullRotation: _propTypes2.default.number
};
Rotation.defaultProps = {
  cycle: false,
  scroll: true,
  vertical: false,
  tabIndex: 0,
  autoPlay: false,
  pauseOnHover: false,
  onChange: function onChange() {}
};
exports.default = Rotation;
