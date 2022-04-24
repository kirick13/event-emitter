module.exports=(e={})=>({emit(o,...t){(e[o]??[]).forEach((e=>e(...t)))},on:(o,t)=>(e[o]=(e[o]??new Set).add(t),()=>e[o].delete(t)),once(e,o,t){return t=this.on(e,((...e)=>{t(),o(...e)}))}})
