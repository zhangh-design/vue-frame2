/**
 * @desc
 * 自定义图标加载表
 * 所有图标均从这里加载，方便管理
 * @example
 * <template>
 *   <bx-analyse style="width: 100px;height:100px;"></bx-analyse>
 * </template>
 * <script>
 * import { bxAnalyse } from '@/plugins/icons.js';
 * export default {
 *   components: { bxAnalyse } // 已经是一个组件
 * }
 * </script>
 */
/**
 * @desc
 * 自定义图标加载表
 * 所有图标均从这里加载，方便管理
 * @example
 * <template>
 *   <bx-analyse style="width: 100px;height:100px;"></bx-analyse>
 * </template>
 * <script>
 * import { bxAnalyse } from '@/plugins/icons.js';
 * export default {
 *   components: { bxAnalyse } // 已经是一个组件
 * }
 * </script>
 */
import bxAnalyse from '@assets/icons/bx-analyse.svg?inline'; // path to your '*.svg?inline' file.
import studyState from '@assets/icons/study-state.svg?inline';
import centerEnterprise from '@assets/icons/center-enterprise.svg?inline';
import centerInfo from '@assets/icons/center-info.svg?inline';
import enterQuit from '@assets/icons/enter-quit.svg?inline';
import enterState from '@assets/icons/enter-state.svg?inline';
import notice from '@assets/icons/notice.svg?inline';
import enterReview from '@assets/icons/enter-review.svg?inline';
import reportState from '@assets/icons/report-state.svg?inline';
import reportReview from '@assets/icons/report-review.svg?inline';
import starReview from '@assets/icons/star-review.svg?inline';
import studyRecord from '@assets/icons/study-record.svg?inline';
import studyReview from '@assets/icons/study-review.svg?inline';
import studyTemplate from '@assets/icons/study-template.svg?inline';
import sysGarden from '@assets/icons/sys-garden.svg?inline';
import sysGovernment from '@assets/icons/sys-government.svg?inline';
import sysPermissionSetting from '@assets/icons/sys-permission-setting.svg?inline';
import starState from '@assets/icons/star-state.svg?inline';
import chartLine from '@assets/icons/chart-line.svg?inline';
import typescript from '@assets/icons/typescript.svg?inline';
import tableTransfer from '@assets/icons/table-transfer.svg?inline';
import nestingGrid from '@assets/icons/nesting-grid.svg?inline';
import updateLog from '@assets/icons/update-log.svg?inline';
import html2pdf from '@assets/icons/html2pdf.svg?inline';
import relevanceGrid from '@assets/icons/relevance-grid.svg?inline';
import baseTree from '@assets/icons/base-tree.svg?inline';
import move from '@assets/icons/move.svg?inline';
import downSelect from '@assets/icons/down-select.svg?inline';
import moreCondition from '@assets/icons/more-condition.svg?inline';
import dialog from '@assets/icons/dialog.svg?inline';

export {
  bxAnalyse,
  studyState,
  centerEnterprise,
  centerInfo,
  enterQuit,
  enterReview,
  reportState,
  reportReview,
  starReview,
  studyRecord,
  studyReview,
  studyTemplate,
  sysGarden,
  sysGovernment,
  sysPermissionSetting,
  enterState,
  notice,
  chartLine,
  typescript,
  tableTransfer,
  nestingGrid,
  updateLog,
  html2pdf,
  relevanceGrid,
  baseTree,
  move,
  downSelect,
  moreCondition,
  dialog
};
export default [
  { name: 'bx-analyse', component: bxAnalyse },
  { name: 'study-state', component: studyState },
  { name: 'center-enterprise', component: centerEnterprise },
  { name: 'center-info', component: centerInfo },
  { name: 'enter-quit', component: enterQuit },
  { name: 'enter-review', component: enterReview },
  { name: 'report-state', component: reportState },
  { name: 'report-review', component: reportReview },
  { name: 'star-review', component: starReview },
  { name: 'study-record', component: studyRecord },
  { name: 'study-review', component: studyReview },
  { name: 'study-template', component: studyTemplate },
  { name: 'sys-garden', component: sysGarden },
  { name: 'sys-government', component: sysGovernment },
  { name: 'sys-permission-setting', component: sysPermissionSetting },
  { name: 'enter-state', component: enterState },
  { name: 'notice', component: notice },
  { name: 'star-state', component: starState },
  { name: 'chart-line', component: chartLine },
  { name: 'typescript', component: typescript },
  { name: 'table-transfer', component: tableTransfer },
  { name: 'nesting-grid', component: nestingGrid },
  { name: 'update-log', component: updateLog },
  { name: 'html2pdf', component: html2pdf },
  { name: 'relevanceGrid', component: relevanceGrid },
  { name: 'base-tree', component: baseTree },
  { name: 'move', component: move },
  { name: 'down-select', component: downSelect },
  { name: 'more-condition', component: moreCondition },
  { name: 'dialog', component: dialog }
];
