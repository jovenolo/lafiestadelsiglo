const store = new Vuex.Store({
    state:{
        proximamente: false,
        voto: true,
        resultados: true,
    },
    mtnProximamente(state, n){
        state.proximamente = n;
    },
    mtnVoto(state, n){
        state.voto = n;
    },
    mtnResutlados(state, n){
        state.resultados = n;
    },
    getters:{
        getProximamente(state){
            return state.proximamente;
        },
        getVoto(state){
            return state.voto;
        },
        getResultados(state){
            return state.resultados;
        }
    },
    actions:{
        updateProximamente:({commit}, n) => {
            commit('mtnProximamente', n);
        },
        updateVoto:({commit}, n) => {
            commit('mtnVoto', n);
        },
        updateResultados:({commit}, n) => {
            commit('mtnResultados', n);
        },
    }
});
const home = {
    template:`<app-proximamente></app-proximamente>`
};
const voto = {
    props:['id'],
    template:`
    <div :class="disfraz">
        <app-proximamente></app-proximamente>    
        <app-voto>
            <h3>Votaste por el disfraz Nº ${this.id}</h3>
        </app-voto>
    </div>`,
    computed:{
        disfraz(){
            return `estilo-${this.id}`
        }
    }
};
const resultados = {
    template:`<app-resultados></app-resultados>`
};
const admin = {
    template:`<app-admin></app-admin>`
};
const routes = [
    { path :'/', component: home},
    { path :'/home', component: home},
    { path :'/voto/:id', component: voto, props:true},
    { path :'/resultados', component: resultados},
    { path :'/admin', component: admin}    
]; //La constante routes es un array de objetos que contiene lo que serán las URL de cada componente

const router = new VueRouter({
    routes
});

Vue.component('app-cabezal',{
    props:{
        mainClass:{
            type: String,
            default:'cabezal'
        }
    },
    template:`
    <div :class="[mainClass]">
        <img src="./assets/img/cabezal.png" />
    </div>
    `,
});
Vue.component('app-proximamente',{
    props:{
        mainClass:{
            type: String,
            default:'proximamente flex column flex-center y-flex-center'
        }
    },
    template:`
        <div :class="[mainClass]" v-if="isShow">
            <h2>La votación todavía no está habilitada</h2>
            <h3>Esperá un poco que te vamos a avisar cuando se pueda votar por los mejores disfraces. Pero pensalo bien antes de escanear un código, sólo vas a poder votar por los 3 mejores</h3>
        </div>
    `,
    data(){
        return {
            
        }
    },
    computed:{
        isShow(){
            return store.getters.getProximamente;
        }
    },
});
Vue.component('app-voto',{
    props:{
        mainClass:{
            type: String,
            default:'voto flex column flex-center y-flex-center'
        }
    },
    template:`
    <div :class="[mainClass]" v-if="isShow">    
        <h2>Voto registrado</h2>
        <slot></slot>
    </div>
    `,
    data(){
        return {
            
        }
    },
    computed:{
        isShow(){
            return store.getters.getVoto;
        }
    },
});
Vue.component('app-resultados',{
    props:{
        mainClass:{
            type: String,
            default:'resultados flex column y-flex-center'
        }
    },
    template:`
        <div :class="[mainClass]" v-if="isShow">    
            <h2>Estos son los disfraces más votados</h2>
        </div>
    `,
    data(){
        return {
            
        }
    },
    computed:{
        isShow(){
            return store.getters.getResultados;
        }
    },
});
Vue.component('app-admin',{
    props:{
        mainClass:{
            type: String,
            default:'admin flex column flex-center y-flex-center'
        }
    },
    template:`
        <div :class="[mainClass]">     
            <h2>Administracion</h2>
            <h3>
                <input @click="updateCheckProximamente()" type="checkbox" :checked="checkProximamente" id="proximamente">
                <label for="proximamente">Aplicación en pausa</label>
            </h3>
        </div>
    `,
    data(){
        return {
        }
    },
    computed:{
        checkProximamente(){
            return store.getters.getProximamente;
        }
    },
    methods:{
        updateCheckProximamente(){
            if (store.getters.getProximamente) {
                alert ("chequeado");
                //return store.dispatch('updateProximamente', true);
            } else {
                alert ("no chequeado");
                return store.dispatch('updateProximamente', true);
            }
        },
    }
});

const app = new Vue({
    el: '#app',
    router,
    data: {

    },
});