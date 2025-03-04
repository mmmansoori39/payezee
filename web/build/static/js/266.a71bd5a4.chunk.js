"use strict";(self.webpackChunkweb=self.webpackChunkweb||[]).push([[266],{2010:function(t,n,e){var r=e(1413),o=e(5987),u=e(7939),c=e(6417),a=["children","variant"];n.Z=function(t){var n=t.children,e=t.variant,s=void 0===e?"regular":e,i=(0,o.Z)(t,a);return(0,c.jsx)(u.xu,(0,r.Z)((0,r.Z)({maxWidth:"regular"===s?"900px":"500px",mx:"auto"},i),{},{children:n}))}},3266:function(t,n,e){e.r(n),e.d(n,{default:function(){return G}});var r=e(1413),o=e(9439),u=e(5987),c=e(1544),a=e(7632),s=e(5893),i=e(6417),l=["overflow","overflowX","className"],d=(0,c.G)((function(t,n){var e,o=t.overflow,c=t.overflowX,d=t.className,v=(0,u.Z)(t,l);return(0,i.jsx)(a.m.div,(0,r.Z)((0,r.Z)({ref:n,className:(0,s.cx)("chakra-table__container",d)},v),{},{__css:{display:"block",whiteSpace:"nowrap",WebkitOverflowScrolling:"touch",overflowX:null!=(e=null!=o?o:c)?e:"auto",overflowY:"hidden",maxWidth:"100%"}}))})),v=e(6360),p=e(7094),h=e(5521),f=e(5549),m=e(1237),x=e(3216),j=e(4722),g=e(7939),b=e(1396),Z=e(2814),_=e(7727),w=e(5059),T=e(7313),y=e(5554),S=e(2010),D=e(5503),N=e(9566),k=e(5515),A=e(7522),C=e(1805),P=e(9637),I=[null,new Date],B="all",G=function(){var t=(0,T.useState)(I),n=(0,o.Z)(t,2),e=n[0],u=n[1],c=(0,y.I0)(),a=(0,T.useState)(B),s=(0,o.Z)(a,2),l=s[0],G=s[1],H=(0,y.v9)((function(t){return t.common})),E=H.cityStatusData,X=H.merchants;console.log({cityStatusData:E}),(0,T.useEffect)((function(){(0,A.jP)().then((function(t){var n=t.map((function(t){return(0,r.Z)((0,r.Z)({},t),{},{status:t.isActive?"ACTIVE":"INACTIVE"})}));c((0,D.ZE)(n))}))}),[c]);(0,T.useEffect)((function(){(0,N.gi)({selectedDates:e,merchantId:l===B?null:l}).then((function(t){c((0,D.iu)(t||{}))}))}),[c,l,e]);var O=(0,T.memo)((function(t){var n,e,r,o,u,c,a,s,l,g,b,Z,_=t.data,w=(0,T.useMemo)((function(){return _.length?(console.log({data:_}),_.reduce((function(t,n){return console.log({acc:t}),Object.values(C.HA).forEach((function(e){var r,o,u,c,a,s,i,l;t[e]?(t[e].totalAmount+=(null===(r=n.statuses)||void 0===r||null===(o=r[e])||void 0===o?void 0:o.totalAmount)||0,t[e].count+=(null===(u=n.statuses)||void 0===u||null===(c=u[e])||void 0===c?void 0:c.count)||0):(t[e]={},t[e].totalAmount=(null===(a=n.statuses)||void 0===a||null===(s=a[e])||void 0===s?void 0:s.totalAmount)||0,t[e].count=(null===(i=n.statuses)||void 0===i||null===(l=i[e])||void 0===l?void 0:l.count)||0)})),t}),{})):[]}),[_]);return console.log({totals:w}),null!==_&&void 0!==_&&_.length?(0,i.jsx)(d,{children:(0,i.jsxs)(v.i,{variant:"simple",children:[(0,i.jsx)(p.h,{children:(0,i.jsxs)(h.Tr,{children:[(0,i.jsx)(f.Th,{children:"City"}),(0,i.jsx)(f.Th,{isNumeric:!0,children:"Created"}),(0,i.jsx)(f.Th,{isNumeric:!0,children:"Pending"}),(0,i.jsx)(f.Th,{isNumeric:!0,children:"Completed"}),(0,i.jsx)(f.Th,{isNumeric:!0,children:"Rejected"})]})}),(0,i.jsxs)(m.p,{children:[_.map((function(t){var n,e,r,o,u,c,a,s,l,d,v,p;return(0,i.jsxs)(h.Tr,{children:[(0,i.jsx)(x.Td,{children:t.city}),(0,i.jsxs)(x.Td,{isNumeric:!0,children:[(0,P.S7)((null===(n=t.statuses.created)||void 0===n?void 0:n.totalAmount)||0,0)," ",null!==(e=t.statuses.created)&&void 0!==e&&e.count?"(".concat(null===(r=t.statuses.created)||void 0===r?void 0:r.count,")"):""]}),(0,i.jsxs)(x.Td,{isNumeric:!0,children:[(0,P.S7)((null===(o=t.statuses.pending)||void 0===o?void 0:o.totalAmount)||0,0)," ",null!==(u=t.statuses.pending)&&void 0!==u&&u.count?"(".concat(null===(c=t.statuses.pending)||void 0===c?void 0:c.count,")"):""]}),(0,i.jsxs)(x.Td,{isNumeric:!0,children:[(0,P.S7)((null===(a=t.statuses.completed)||void 0===a?void 0:a.totalAmount)||0,0)," ",null!==(s=t.statuses.completed)&&void 0!==s&&s.count?"(".concat(null===(l=t.statuses.completed)||void 0===l?void 0:l.count,")"):""]}),(0,i.jsxs)(x.Td,{isNumeric:!0,children:[(0,P.S7)((null===(d=t.statuses.rejected)||void 0===d?void 0:d.totalAmount)||0,0)," ",null!==(v=t.statuses.rejected)&&void 0!==v&&v.count?"(".concat(null===(p=t.statuses.rejected)||void 0===p?void 0:p.count,")"):""]})]},t.city)})),(0,i.jsxs)(h.Tr,{children:[(0,i.jsx)(x.Td,{textDecoration:"underline",children:"TOTAL"}),(0,i.jsxs)(x.Td,{isNumeric:!0,children:[(0,P.S7)((null===w||void 0===w||null===(n=w.created)||void 0===n?void 0:n.totalAmount)||0,0)," ",null!==w&&void 0!==w&&null!==(e=w.created)&&void 0!==e&&e.count?"(".concat(null===w||void 0===w||null===(r=w.created)||void 0===r?void 0:r.count,")"):""]}),(0,i.jsxs)(x.Td,{isNumeric:!0,children:[(0,P.S7)((null===w||void 0===w||null===(o=w.pending)||void 0===o?void 0:o.totalAmount)||0,0)," ",null!==w&&void 0!==w&&null!==(u=w.pending)&&void 0!==u&&u.count?"(".concat(null===w||void 0===w||null===(c=w.pending)||void 0===c?void 0:c.count,")"):""]}),(0,i.jsxs)(x.Td,{isNumeric:!0,children:[(0,P.S7)((null===w||void 0===w||null===(a=w.completed)||void 0===a?void 0:a.totalAmount)||0,0)," ",null!==w&&void 0!==w&&null!==(s=w.completed)&&void 0!==s&&s.count?"(".concat(null===w||void 0===w||null===(l=w.completed)||void 0===l?void 0:l.count,")"):""]}),(0,i.jsxs)(x.Td,{isNumeric:!0,children:[(0,P.S7)((null===w||void 0===w||null===(g=w.rejected)||void 0===g?void 0:g.totalAmount)||0,0)," ",null!==w&&void 0!==w&&null!==(b=w.rejected)&&void 0!==b&&b.count?"(".concat(null===w||void 0===w||null===(Z=w.rejected)||void 0===Z?void 0:Z.count,")"):""]})]})]})]})}):(0,i.jsx)(j.x,{textAlign:"center",children:"No records found!"})}));return(0,i.jsx)(S.Z,{p:{base:"3",md:"5"},children:(0,i.jsxs)(g.xu,{bg:"white",p:"4",borderRadius:"8",children:[(0,i.jsxs)(b.k,{gap:8,children:[(0,i.jsx)(k.ou,{propsConfigs:{dayOfMonthBtnProps:{defaultBtnProps:{_hover:{background:"teal",color:"white"}},selectedBtnProps:{background:"teal",color:"white"},isInRangeBtnProps:{background:"teal",color:"white"},todayBtnProps:{colorScheme:"teal"}},popoverCompProps:{popoverContentProps:{colorScheme:"teal"},popoverBodyProps:{colorScheme:"teal"}},dateNavBtnProps:{colorScheme:"teal"}},maxDate:new Date,selectedDates:e,onDateChange:u}),(0,i.jsxs)(Z.P,{mb:"6",onChange:function(t){G(t.currentTarget.value)},value:l,children:[(0,i.jsx)("option",{value:B,children:"all merchants"}),(null===X||void 0===X?void 0:X.length)&&X.map((function(t){return(0,i.jsx)("option",{value:t.id,children:t.name},t.id)}))]}),(0,i.jsx)(_.z,{mb:"6",px:8,type:"button",colorScheme:"teal",onClick:function(){u(I),G(B)},children:"Reset"})]}),(0,i.jsx)(w.X,{mb:"8",as:"h1",size:"md",textAlign:"center",children:"Deposits"}),(0,i.jsx)(O,{data:(null===E||void 0===E?void 0:E.deposit)||[]}),(0,i.jsx)(w.X,{mb:"8",mt:"8",as:"h1",size:"md",textAlign:"center",children:"Payouts"}),(0,i.jsx)(O,{data:(null===E||void 0===E?void 0:E.cashout)||[]})]})})}},7522:function(t,n,e){e.d(n,{Dn:function(){return s},jP:function(){return c},qe:function(){return a}});var r=e(4165),o=e(5861),u=e(2140),c=function(){var t=(0,o.Z)((0,r.Z)().mark((function t(){var n;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.x1.get("/merchant");case 2:if(200!==(n=t.sent).status){t.next=5;break}return t.abrupt("return",n.data.responseData||[]);case 5:return t.abrupt("return",[]);case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),a=function(t){return u.x1.post("/merchant",t)},s=function(t,n){return u.x1.put("/merchant/".concat(t),n)}},9566:function(t,n,e){e.d(n,{AS:function(){return c},IA:function(){return a},_9:function(){return s},gi:function(){return i},l7:function(){return l},n6:function(){return d},pw:function(){return v},xl:function(){return p}});var r=e(4165),o=e(5861),u=e(2140),c=function(){var t=(0,o.Z)((0,r.Z)().mark((function t(n){var e,o,c,a,s,i,l;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=n.selectedDates,o=void 0===e?[]:e,c=n.merchantId,a=[],o[0]&&o[1]&&(s=new Date(o[0]),i=new Date(o[1]),s.setHours(0,0,0),i.setHours(23,59,59),a.push("created_at_gte=".concat(s.toString())),a.push("created_at_lte=".concat(i.toString()))),c&&a.push("merchant_id=".concat(c)),t.next=6,u.x1.get("/deposit?".concat(a.join("&")));case 6:if(200!==(l=t.sent).status){t.next=9;break}return t.abrupt("return",l.data.responseData||[]);case 9:return t.abrupt("return",[]);case 10:case"end":return t.stop()}}),t)})));return function(n){return t.apply(this,arguments)}}(),a=function(){var t=(0,o.Z)((0,r.Z)().mark((function t(n){var e,o,c,a,s,i,l,d,v,p,h;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=n.selectedDates,o=void 0===e?[]:e,c=n.transactionType,a=void 0===c?"deposit":c,s=n.merchantId,i=void 0===s?null:s,l=[],o[0]&&o[1]&&(d=new Date(o[0]),v=new Date(o[1]),d.setHours(0,0,0),v.setHours(23,59,59),l.push("created_at_gte=".concat(d.toString())),l.push("created_at_lte=".concat(v.toString()))),a&&l.push("transaction_type=".concat(a)),i&&l.push("merchant_id=".concat(i)),t.next=7,u.x1.get("/generate-report?".concat(l.join("&")));case 7:if(200!==(p=t.sent).status){t.next=10;break}return t.abrupt("return",(null===p||void 0===p||null===(h=p.data)||void 0===h?void 0:h.responseData)||null);case 10:return t.abrupt("return",null);case 11:case"end":return t.stop()}}),t)})));return function(n){return t.apply(this,arguments)}}(),s=function(){var t=(0,o.Z)((0,r.Z)().mark((function t(n){var e,o,c,a,s,i,l;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=n.selectedDates,o=void 0===e?[]:e,c=n.merchantId,a=[],o[0]&&o[1]&&(s=new Date(o[0]),i=new Date(o[1]),s.setHours(0,0,0),i.setHours(23,59,59),a.push("created_at_gte=".concat(s.toString())),a.push("created_at_lte=".concat(i.toString()))),c&&a.push("merchant_id=".concat(c)),t.next=6,u.x1.get("/cashout?".concat(a.join("&")));case 6:if(200!==(l=t.sent).status){t.next=9;break}return t.abrupt("return",l.data.responseData||[]);case 9:return t.abrupt("return",[]);case 10:case"end":return t.stop()}}),t)})));return function(n){return t.apply(this,arguments)}}(),i=function(){var t=(0,o.Z)((0,r.Z)().mark((function t(n){var e,o,c,a,s,i;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=n.selectedDates,o=void 0===e?[]:e,c=n.merchantId,a=void 0===c?null:c,s=[],o[0]&&o[1]&&(s.push("created_at_gte=".concat(o[0])),s.push("created_at_lte=".concat(o[1]))),a&&s.push("merchant_id=".concat(a)),t.next=6,u.x1.get("/getPaymentsByCityAndStatus?".concat(s.join("&")));case 6:if(200!==(i=t.sent).status){t.next=9;break}return t.abrupt("return",i.data.responseData||{});case 9:return t.abrupt("return",[]);case 10:case"end":return t.stop()}}),t)})));return function(n){return t.apply(this,arguments)}}(),l=function(t,n,e){var r={status:n};return e&&(r.comment=e),u.x1.put("/deposit/".concat(t),r)},d=function(t,n){return u.x1.put("/deposit/deleteComment/".concat(t,"/").concat(n))},v=function(t,n){return u.x1.put("/cashout/deleteComment/".concat(t,"/").concat(n))},p=function(t,n,e){var r={status:n};return e&&(r.comment=e),u.x1.put("/cashout/".concat(t),r)}},6360:function(t,n,e){e.d(n,{i:function(){return j},p:function(){return x}});var r=e(1413),o=e(5987),u=e(9439),c=e(1544),a=e(465),s=e(1877),i=e(7632),l=e(5893),d=e(7623),v=e(6417),p=["className","layout"],h=(0,d.k)({name:"TableStylesContext",errorMessage:"useTableStyles returned is 'undefined'. Seems you forgot to wrap the components in \"<Table />\" "}),f=(0,u.Z)(h,2),m=f[0],x=f[1],j=(0,c.G)((function(t,n){var e=(0,a.jC)("Table",t),u=(0,s.Lr)(t),c=u.className,d=u.layout,h=(0,o.Z)(u,p);return(0,v.jsx)(m,{value:e,children:(0,v.jsx)(i.m.table,(0,r.Z)({ref:n,__css:(0,r.Z)({tableLayout:d},e.table),className:(0,l.cx)("chakra-table",c)},h))})}));j.displayName="Table"},3216:function(t,n,e){e.d(n,{Td:function(){return l}});var r=e(1413),o=e(5987),u=e(6360),c=e(1544),a=e(7632),s=e(6417),i=["isNumeric"],l=(0,c.G)((function(t,n){var e=t.isNumeric,c=(0,o.Z)(t,i),l=(0,u.p)();return(0,s.jsx)(a.m.td,(0,r.Z)((0,r.Z)({},c),{},{ref:n,__css:l.td,"data-is-numeric":e}))}))},1237:function(t,n,e){e.d(n,{p:function(){return s}});var r=e(1413),o=e(6360),u=e(1544),c=e(7632),a=e(6417),s=(0,u.G)((function(t,n){var e=(0,o.p)();return(0,a.jsx)(c.m.tbody,(0,r.Z)((0,r.Z)({},t),{},{ref:n,__css:e.tbody}))}))},7094:function(t,n,e){e.d(n,{h:function(){return s}});var r=e(1413),o=e(6360),u=e(1544),c=e(7632),a=e(6417),s=(0,u.G)((function(t,n){var e=(0,o.p)();return(0,a.jsx)(c.m.thead,(0,r.Z)((0,r.Z)({},t),{},{ref:n,__css:e.thead}))}))},5521:function(t,n,e){e.d(n,{Tr:function(){return s}});var r=e(1413),o=e(6360),u=e(1544),c=e(7632),a=e(6417),s=(0,u.G)((function(t,n){var e=(0,o.p)();return(0,a.jsx)(c.m.tr,(0,r.Z)((0,r.Z)({},t),{},{ref:n,__css:e.tr}))}))},5549:function(t,n,e){e.d(n,{Th:function(){return l}});var r=e(1413),o=e(5987),u=e(6360),c=e(1544),a=e(7632),s=e(6417),i=["isNumeric"],l=(0,c.G)((function(t,n){var e=t.isNumeric,c=(0,o.Z)(t,i),l=(0,u.p)();return(0,s.jsx)(a.m.th,(0,r.Z)((0,r.Z)({},c),{},{ref:n,__css:l.th,"data-is-numeric":e}))}))}}]);