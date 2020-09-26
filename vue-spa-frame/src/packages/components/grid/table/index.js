/**
 * Table 表格组件
 */
import _map from 'lodash/map';
import _has from 'lodash/has';
import _isEmpty from 'lodash/isEmpty';
import _assign from 'lodash/assign';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _filter from 'lodash/filter';
import _some from 'lodash/some';
import _omit from 'lodash/omit';
import _find from 'lodash/find';
import _isArray from 'lodash/isArray';

const BaseGridTable = {
  name: 'BaseGridTable',
  inject: ['getBaseGrid'],
  props: {
    api: {
      type: String,
      default: ''
    },
    queryParams: {
      type: Object,
      default() {
        return {};
      }
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否多选
    selectMode: {
      type: Boolean,
      default: false
    },
    // 是否显示 index 下标列
    isShowIndex: {
      type: Boolean,
      default: false
    },
    // 默认选择第一行
    isSelectedFirstRow: {
      type: Boolean,
      default: true
    },
    // 第一次载入时是否自动刷新列表数据
    isReloadGrid: {
      type: Boolean,
      default: true
    },
    // Table Slot
    slotNode: {
      type: Object,
      default() {
        return {};
      }
    },
    // Table Attributes
    tableAttributes: {
      type: Object,
      default() {
        return {};
      }
    },
    // 过滤返回数据（该函数带一个参数'data'用来指向源数据）
    loadFilter: {
      type: Function
    }
  },
  data() {
    this.curQueryParams = {};
    // this.loading = null;
    this.currentRows = []; // 当前选中行集
    return {
      loading: true,
      currentRow: {}, // 当前选中行
      tableData: []
    };
  },
  computed: {
    // 单选设置行选中
    _highlightCurrentRow() {
      return !this.selectMode;
    }
  },
  watch: {
    // 更新选中行
    currentRow(val) {
      this.getBaseGrid.updateCurrentRow(val);
    },
    // 监测数据源
    tableData(val) {
      if (this.isSelectedFirstRow && !_isEmpty(val)) {
        setTimeout(() => {
          if (this.selectMode) {
            this.$refs[`${this._uid}-base-table`].toggleRowSelection(
              this.tableData[0]
            );
          } else {
            this.currentRow = this.tableData[0];
            this.$refs[`${this._uid}-base-table`].setCurrentRow(
              this.tableData[0]
            );
          }
        }, 0);
      }
      if (_isEmpty(val)) {
        this.currentRow = {};
        this.currentRows = [];
      }
      // 数据加载完成
      this.getBaseGrid.onLoadSuccess(val);
    }
  },
  mounted() {
    if (_has(this.getBaseGrid.$listeners, 'onBeforeLoad')) {
      const result = this.getBaseGrid.$listeners.onBeforeLoad();
      if (result !== false) {
        this.init();
      }
    } else {
      this.init();
    }
    this.getBaseGrid.setTableEl(this);
  },
  methods: {
    /**
     * @desc 当某一行被双击时会触发该事件
     * @event BaseGridTable#_rowDblclickEvent
     * @param {Object} row - 行数据对象
     * @param {Object} column - 列对象 例如：{label: "地址", id: "el-table_1_column_4", property: "address"}
     * @param {*} event - 点击事件对象
     */
    _rowDblclickEvent(row, column, event) {
      if (_has(this.getBaseGrid.$listeners, 'row-dblclick')) {
        this.getBaseGrid.$emit('row-dblclick', row, column, event);
      } else {
        // 其它可能需要扩展的逻辑
        // 显示详情弹框
        this.getBaseGrid.$emit('update:dialogVisible', true);
      }
    },
    /**
     * @desc 当选择项发生变化时会触发该事件
     * @event BaseGridTable#_selectionChangeEvent
     * @param {Array} selection - 勾选中的行集合
     */
    _selectionChangeEvent(selection) {
      this.currentRows = selection;
      if (_has(this.getBaseGrid.$listeners, 'selection-change')) {
        this.getBaseGrid.$emit('selection-change', selection);
      }
    },
    /**
     * @desc 当某一行被点击时会触发该事件
     * @event BaseGridTable#_rowClickEvent
     * @param {Object} row - 行数据对象
     * @param {Object} column - 列对象 例如：{label: "地址", id: "el-table_1_column_4", property: "address"}
     * @param {*} event - 点击事件对象
     */
    _rowClickEvent(row, column, event) {
      if (!this.selectMode) {
        this.currentRow = row;
      }
      if (_has(this.getBaseGrid.$listeners, 'row-click')) {
        this.getBaseGrid.$emit('row-click', row, column, event);
      }
    },
    /**
     * @desc 初始化
     * @method
     */
    init() {
      this.isReloadGrid && this.loadData();
    },
    /**
     * @desc 加载数据
     * @method
     */
    loadData() {
      if (!this.api) {
        return;
      }
      // this.loadMask();
      (!this.loading) && (this.loading = true);
      const params = _assign(
        {},
        {
          [_get(this['$base-global-options'], 'grid.pageNum', 'pageNum')]: this.getBaseGrid.currentPage,
          [_get(this['$base-global-options'], 'grid.pageSize', 'pageSize')]: this.getBaseGrid.pageSize
        },
        this.queryParams,
        this.curQueryParams
      );
      this.$api[this.api]({ params })
        .then(response => {
          this.getBaseGrid.setTotal(
            _get(
              response,
              _get(this['$base-global-options'], 'grid.total', ''),
              0
            )
          );
          const data = _get(
            response,
            _get(this['$base-global-options'], 'grid.data', ''),
            []
          );
          this.tableData = _isNil(this.loadFilter)
            ? data
            : this.loadFilter(data);
        })
        .catch(error => {
          this.getBaseGrid.onLoadError();
          throw new Error(error);
        })
        .finally(() => {
          // this.loading.close();
          this.loading && (this.loading = false);
        });
    },
    /**
     * @desc 设置查询参数
     * @param {Object} params
     */
    setQueryParams(params = {}) {
      this.curQueryParams = {};
      return Object.assign(this.curQueryParams, params);
    },
    /**
     * @desc 获取 el-table 组件
     * @method
     */
    getEl() {
      return this.$refs[`${this._uid}-base-table`];
    },
    /**
     * @desc 显示加载中遮罩
     * @method
     */
    loadMask() {
      // this.loading = this.$loading({
      //   lock: true,
      //   target: this.$el
      // });
    },
    /**
     * @desc 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
     * @param {Array} field=[] - 行选中的配置数组对象
     * @type {Object}
     * @property {string} field='id' - 字段key
     * @property {string} value - 字段值
     * @property {Boolean} selected=true - 是否选中（未实现）
     * @method
     * @example
     * // 选中数据data数组中键为id和值等于100的行
     * toggleRowSelection([{field: 'id', value: '100', selected: true}])
     */
    toggleRowSelection(rows = []) {
      if (!this.selectMode) {
        return;
      }
      const selectRows = _filter(this.tableData, item => {
        return _some(rows, function (row) {
          return item[row.field || 'id'] === row.value;
        });
      });
      if (!_isEmpty(selectRows)) {
        for (const key in selectRows) {
          const selectRow = selectRows[key];
          this.$refs[`${this._uid}-base-table`].toggleRowSelection(selectRow);
        }
        /* for (const selectRow of selectRows.values()) {
          this.$refs[`${this._uid}-base-table`].toggleRowSelection(selectRow)
        } */
      }
    },
    /**
     * @desc 用于多选表格，切换所有行的选中状态
     * @method
     */
    toggleAllSelection() {
      if (!this.selectMode) {
        return;
      }
      this.$refs[`${this._uid}-base-table`].toggleAllSelection();
    },
    /**
     * @desc 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
     * @param {Object} row={} - 行选中的配置对象
     * @type {Object}
     * @property {string} field='id' - 字段key
     * @property {string} value - 字段值
     * @method
     * @example
     * setCurrentRow({ field: 'id', value: 2 })
     */
    setCurrentRow(row = {}) {
      if (this.selectMode) {
        return;
      }
      if (_isEmpty(row)) {
        this.$refs[`${this._uid}-base-table`].setCurrentRow();
        return;
      }
      const selectRow = _find(this.tableData, item => {
        return item[row.field || 'id'] === row.value;
      });
      if (!_isEmpty(selectRow)) {
        if (this.selectMode) {
          this.$refs[`${this._uid}-base-table`].toggleRowSelection(selectRow);
        } else {
          this.currentRow = selectRow;
          this.$refs[`${this._uid}-base-table`].setCurrentRow(selectRow);
        }
      }
    },
    /**
     * @desc 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件
     * @param {*} columnKey - columnKey组成的数组以清除指定列的过滤条件
     * @method
     * clearFilter('code') / clearFilter(['code'])
     */
    clearFilter(columnKey) {
      const keys = [];
      if (!_isArray(columnKey)) {
        keys.push(columnKey);
      }
      if (!_isEmpty(keys)) {
        const table = this.$refs[`${this._uid}-base-table`];
        for (let i = 0; i < keys.length; i++) {
          table.clearFilter(keys[i]);
        }
        /* for (const elem of columnKey.values()) {
          this.$refs[`${this._uid}-base-table`].clearFilter(elem)
        } */
      } else {
        this.$refs[`${this._uid}-base-table`].clearFilter();
      }
    },

    /**
     * @desc 清空表单
     * @method
     */
    clearTable() {
      this.tableData = [];
    },
    /**
     * @desc 获取当前选中行
     * @method
     * @returns {Object}
     */
    getSelectedRow() {
      return this.currentRow;
    },
    /**
     * @desc 获取当前选中行集
     * @method
     * @returns {Array}
     */
    getSelectedRows() {
      return this.currentRows;
    },
    // 构建列 el-table-column
    tableColumnNodes() {
      return _map(this.columns, elem => {
        let filterMethod = null;
        let columnKey = null;
        if (_has(elem, 'filters') && _has(elem, 'filter-method')) {
          filterMethod = function (value, row, column) {
            return elem['filter-method'](value, row, column);
          };
        }
        if (_has(elem, 'filters') && !_has(elem, 'filter-method')) {
          filterMethod = function (value, row, column) {
            const property = column.property;
            return row[property] === value;
          };
        }
        if (filterMethod != null) {
          columnKey = elem.name;
        }
        return this.$createElement('el-table-column', {
          props: _assign(
            {},
            _omit(elem, ['render', 'renderHeader', 'unit']),
            { 'filter-method': filterMethod, columnKey: columnKey }
          ),
          scopedSlots: {
            default: ({ row, column, $index }) => {
              // 自定义列的内容
              if (_has(elem, 'render')) {
                let columnValue = row[column.property];
                if (_has(elem, 'filter')) {
                  const dict = _find(this.$dict.get(elem.filter), (item) => {
                    return item.paramValue === row[column.property];
                  });
                  if (dict) {
                    columnValue = `${dict.paramDesc}${_get(elem, 'unit', '')}`;
                  }
                }
                return elem.render(this.$createElement, row, column, $index, columnValue);
              } else if (_has(elem, 'slotNode')) {
                return _map(elem.slotNode, ({ render }) => {
                  return render(this.$createElement, row, column, $index);
                });
              } else {
                if (_has(elem, 'filter')) {
                  const dict = _find(this.$dict.get(elem.filter), (item) => {
                    return item.paramValue === row[column.property];
                  });
                  if (dict) {
                    return `${dict.paramDesc}${_get(elem, 'unit', '')}`;
                  }
                }
                return `${row[column.property]}${_get(elem, 'unit', '')}`;
              }
            },
            header: ({ column, $index }) => {
              // 自定义表头的内容 不能和属性 `render-header`一起使用否则起效的是`render-header`
              if (_has(elem, 'renderHeader')) {
                return elem.renderHeader(this.$createElement, column, $index);
              } else {
                return column.label;
              }
            }
          }
        });
      });
    },
    // Table Slot
    appendNode() {
      return _has(this.$props, 'slotNode.append')
        ? [this.$props.slotNode.append(this.$createElement)]
        : [];
    },
    // 多选 el-table-column
    multipleSelectNode() {
      return this.selectMode
        ? this.$createElement('el-table-column', {
          props: { type: 'selection', width: '50px' }
        })
        : [];
    },
    // 下标列
    indexColumn() {
      return this.isShowIndex
        ? this.$createElement('el-table-column', {
          props: { type: 'index', width: '50px' }
        })
        : [];
    }
  },
  render(h) {
    return h(
      'el-table',
      {
        ref: `${this._uid}-base-table`,
        class: _get(this.$props, 'ctCls', {}),
        props: _assign({ border: true }, this.tableAttributes, {
          height: '100%', // 实现固定表头的表格，数据可滚动
          highlightCurrentRow: this._highlightCurrentRow,
          data: this.tableData
        }),
        on: _assign(
          {},
          _omit(this.getBaseGrid.$listeners, [
            'selection-change',
            'row-dblclick',
            'row-click'
          ]),
          {
            'selection-change': this._selectionChangeEvent,
            'row-dblclick': this._rowDblclickEvent,
            'row-click': this._rowClickEvent
          }
        ),
        directives: [
          {
            name: 'loading',
            value: this.loading
            // 'v-loading': true
          }
        ]
      },
      [
        this.indexColumn(),
        this.multipleSelectNode(),
        this.tableColumnNodes(),
        h('template', { slot: 'append' }, this.appendNode())
      ]
    );
  }
};
export default BaseGridTable;
