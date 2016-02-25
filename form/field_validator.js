'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _validator = require('src/utils/validator');

var _validator2 = _interopRequireDefault(_validator);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _field = require('components/controls/field.js');

var _field2 = _interopRequireDefault(_field);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EMPTY = Symbol();
var VALID = Symbol();
var INVALID = Symbol();

var FieldValidator = function (_React$Component) {
  _inherits(FieldValidator, _React$Component);

  function FieldValidator(props) {
    _classCallCheck(this, FieldValidator);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FieldValidator).call(this, props));

    _this.validationFunction = _validator2.default.create(_this.props.constraints);
    _this.state = {
      status: EMPTY,
      errors: []
    };
    return _this;
  }

  _createClass(FieldValidator, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_field2.default, _extends({}, _lodash2.default.omit(this.props, ['children', 'constraints']), {
        onChange: this.handleChange.bind(this),
        error: this.getError() }));
    }
  }, {
    key: 'handleChange',
    value: function handleChange(code, value) {
      if (_lodash2.default.isEmpty(value)) {
        this.setState({ status: EMPTY });
      } else {
        var v = this.validationFunction(value);
        if (v.status === 'passed') {
          this.setState({ status: VALID, errors: [] });
        } else {
          this.setState({ status: INVALID, errors: v.errors });
        }
      }
      this.props.handleChange(code, value);
    }
  }, {
    key: 'getError',
    value: function getError() {
      if (this.state.status === INVALID) {
        return _lodash2.default.first(this.state.errors);
      }
    }
  }]);

  return FieldValidator;
}(_react2.default.Component);

FieldValidator.defaultProps = {
  constraints: {
    required: true
  },
  onChange: _lodash2.default.noop
};
exports.default = FieldValidator;