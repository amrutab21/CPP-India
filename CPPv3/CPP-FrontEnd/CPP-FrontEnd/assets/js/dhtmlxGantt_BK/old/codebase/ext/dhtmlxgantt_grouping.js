/*
@license

dhtmlxGantt v.3.2.0 Professional Evaluation
This software is covered by DHTMLX Evaluation License. Contact sales@dhtmlx.com to get Commercial or Enterprise license. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
gantt._groups={relation_property:null,relation_id_property:"$group_id",group_id:null,group_text:null,loading:!1,loaded:0,init:function(t){var e=this;t.attachEvent("onClear",function(){e.clear()}),e.clear();var n=t._get_parent_id;t._get_parent_id=function(i){return e.is_active()?e.get_parent(t,i):n.apply(this,arguments)};var i=t.setParent;t.setParent=function(n,a){if(!e.is_active())return i.apply(this,arguments);if(t.isTaskExists(a)){var s=t.getTask(a);n[e.relation_property]=s[e.relation_id_property];

}},t.attachEvent("onBeforeTaskDisplay",function(n,i){return e.is_active()&&i.type==t.config.types.project&&!i.$virtual?!1:!0}),t.attachEvent("onBeforeParse",function(){e.loading=!0}),t.attachEvent("onTaskLoading",function(){return e.is_active()&&(e.loaded--,e.loaded<=0&&(e.loading=!1,t.eachTask(dhtmlx.bind(function(e){this.get_parent(t,e,tasks)},e)),t._sync_order())),!0}),t.attachEvent("onParse",function(){e.loading=!1,e.loaded=0})},get_parent:function(t,e,n){var i=e[this.relation_property];if(void 0!==this._groups_pull[i])return this._groups_pull[i];

var a=t.config.root_id;return this.loading||(a=this.find_parent(n||t.getTaskByTime(),i,this.relation_id_property,t.config.root_id),this._groups_pull[i]=a),a},find_parent:function(t,e,n,i){for(var a=0;a<t.length;a++){var s=t[a];if(void 0!==s[n]&&s[n]==e)return s.id}return i},clear:function(){this._groups_pull={},this.relation_property=null,this.group_id=null,this.group_text=null},is_active:function(){return!!this.relation_property},generate_sections:function(t,e){for(var n=[],i=0;i<t.length;i++){var a=dhtmlx.copy(t[i]);

a.type=e,a.open=!0,a.$virtual=!0,a.readonly=!0,a[this.relation_id_property]=a[this.group_id],a.text=a[this.group_text],n.push(a)}return n},clear_temp_tasks:function(t){for(var e=0;e<t.length;e++)t[e].$virtual&&(t.splice(e,1),e--)},generate_data:function(t,e){var n=t.getLinks(),i=t.getTaskByTime();this.clear_temp_tasks(i);var a=[];this.is_active()&&e&&e.length&&(a=this.generate_sections(e,t.config.types.project));var s={links:n};return s.data=a.concat(i),s},update_settings:function(t,e,n){this.clear(),
this.relation_property=t,this.group_id=e,this.group_text=n},group_tasks:function(t,e,n,i,a){this.update_settings(n,i,a);var s=this.generate_data(t,e);this.loaded=s.data.length,t._clear_data(),t.parse(s)}},gantt._groups.init(gantt),gantt.groupBy=function(t){t=t||{};var e=t.groups||null,n=t.relation_property||null,i=t.group_id||"key",a=t.group_text||"label";this._groups.group_tasks(this,e,n,i,a)};
//# sourceMappingURL=../sources/ext/dhtmlxgantt_grouping.js.map