module.exports=(e={})=>({emit(t,...n){(e[t]??[]).forEach((e=>e(...n)))},on:(t,n)=>(e[t]=(e[t]??new Set).add(n),()=>e[t].delete(n)),once(e,t,n){return n=this.on(e,((...e)=>{n(),t(...e)}))}})
