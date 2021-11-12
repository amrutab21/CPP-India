/*
@license

dhtmlxGantt v.3.2.0 Professional Evaluation
This software is covered by DHTMLX Evaluation License. Contact sales@dhtmlx.com to get Commercial or Enterprise license. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
Gantt.plugin(function(t){t.config.highlight_critical_path=!1,t._criticalPathHandler=function(){t.config.highlight_critical_path&&t.render()},t.attachEvent("onAfterLinkAdd",t._criticalPathHandler),t.attachEvent("onAfterLinkUpdate",t._criticalPathHandler),t.attachEvent("onAfterLinkDelete",t._criticalPathHandler),t.attachEvent("onAfterTaskAdd",t._criticalPathHandler),t.attachEvent("onAfterTaskUpdate",t._criticalPathHandler),t.attachEvent("onAfterTaskDelete",t._criticalPathHandler),t.isCriticalTask=function(t){
if(t){var e=arguments[1]||{};if(this._isTask(t)){if(this._isProjectEnd(t))return!0;e[t.id]=!0;for(var n=this._getSuccessors(t),i=0;i<n.length;i++){var a=this.getTask(n[i].task);if(this._getSlack(t,a,n[i].link)<=0&&!e[a.id]&&this.isCriticalTask(a,e))return!0}}return!1}},t.isCriticalLink=function(e){return this.isCriticalTask(t.getTask(e.source))},t.getSlack=function(t,e){for(var n=[],i={},a=0;a<t.$source.length;a++)i[t.$source[a]]=!0;for(var a=0;a<e.$target.length;a++)i[e.$target[a]]&&n.push(e.$target[a]);

for(var s=[],a=0;a<n.length;a++)s.push(this._getSlack(t,e,this.getLink(n[a]).type));return Math.min.apply(Math,s)},t._getSlack=function(t,e,n){if(null===n)return 0;var i=null,a=null,s=this.config.links,r=this.config.types;return i=n!=s.finish_to_finish&&n!=s.finish_to_start||this._get_safe_type(t.type)==r.milestone?t.start_date:t.end_date,a=n!=s.finish_to_finish&&n!=s.start_to_finish||this._get_safe_type(e.type)==r.milestone?e.start_date:e.end_date,this.calculateDuration(i,a)},t._getProjectEnd=function(){
var e=t.getTaskByTime();return e=e.sort(function(t,e){return+t.end_date>+e.end_date?1:-1}),e.length?e[e.length-1].end_date:null},t._isProjectEnd=function(t){return!this._hasDuration(t.end_date,this._getProjectEnd())},t._isTask=function(e){return!(e.type&&e.type==t.config.types.project||e.$no_start||e.$no_end)},t._isProject=function(t){return!this._isTask(t)},t._formatSuccessors=function(t,e){for(var n=[],i=0;i<t.length;i++)n.push(this._formatSuccessor(t[i],e));return n},t._formatSuccessor=function(t,e){
return{task:t,link:e}},t._getSuccessors=function(e){var n=[];if(t._isProject(e))n=n.concat(t._formatSuccessors(this.getChildren(e.id),null));else for(var i=e.$source,a=0;a<i.length;a++){var s=this.getLink(i[a]);if(this.isTaskExists(s.target)){var r=this.getTask(s.target);this._isTask(r)?n.push(t._formatSuccessor(s.target,s.type)):n=n.concat(t._formatSuccessors(this.getChildren(r.id),s.type))}}return n}});
//# sourceMappingURL=../sources/ext/dhtmlxgantt_critical_path.js.map