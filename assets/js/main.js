const store = new Vuex.Store({
    state:{
        proximamente: false,
        voto: true,
        resultados: true,
    },
    mutations:{
        mtnProximamente(state, n){
            state.proximamente = n;
        },
        mtnVoto(state, n){
            state.voto = n;
        },
        mtnResultados(state, n){
            state.resultados = n;
        },
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
            <h3 id="votoEfectuado">Votaste por el disfraz Nº {{disfraz}}</h3>
        </app-voto>
    </div>`,
    computed:{
        disfraz(){
            return `${this.id}`
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
        <h2 id="votoRegistrado">Tu voto quedó registrado</h2>
        <slot></slot>
        <h3 id="votosRestantes"></h3>
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
    methods:{
        // Get a reference to the database service
        var database = firebase.database();
    },
    mounted(){
        var lasCookies = document.cookie;
        if (lasCookies){
            cantidadVotos = parseInt(lasCookies.substring(14));
            if (cantidadVotos === 3) {
                document.getElementById("votoRegistrado").innerHTML = "Ya votaste 3 veces";
                document.getElementById("votoEfectuado").innerHTML = "";
            } else {
                cantidadVotos = cantidadVotos+1;
                document.cookie = "cantidadVotos="+ cantidadVotos;
                if (cantidadVotos === 3) {
                    document.getElementById("votosRestantes").innerHTML = "Este fue tu último voto. Te avisaremos cuando estén los resultados.";
                } else {
                    document.getElementById("votosRestantes").innerHTML = "Te queda otro voto más.";
                } 
            }
        } else {
            document.cookie = "cantidadVotos=1; max-age=86400; path=/";
            document.getElementById("votosRestantes").innerHTML = "Te quedan 2 votos.";
        }
    }
    
});
Vue.component('app-resultados',{
    props:{
        mainClass:{
            type: String,
            default:'resultados flex column y-flex-center'
        }
    },
    template:`
        <div :class="[mainClass]" v-if="!isShow">    
            <h2>Los resultados todavía no están prontos. Te avisaremos cuando estén disponibles</h2>
        </div>
        <div :class="[mainClass]" v-else-if="isShow">    
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
            <h3>
                <input @click="updateCheckVoto()" type="checkbox" :checked="checkVoto" id="voto">
                <label for="voto">Votación habilitada</label>
            </h3>
            <h3>
                <input @click="updateCheckResultados()" type="checkbox" :checked="checkResultados" id="resultados">
                <label for="resultados">Resultados habilitados</label>
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
        },
        checkVoto(){
            return store.getters.getVoto;
        },
        checkResultados(){
            return store.getters.getResultados;
        }
    },
    methods:{
        updateCheckProximamente(){
            if (store.getters.getProximamente) {
                return store.dispatch('updateProximamente', false);
            } else {
                return store.dispatch('updateProximamente', true);
            }
        },
        updateCheckVoto(){
            if (store.getters.getVoto) {
                return store.dispatch('updateVoto', false);
            } else {
                return store.dispatch('updateVoto', true);
            }
        },
        updateCheckResultados(){
            if (store.getters.getResultados) {
                return store.dispatch('updateResultados', false);
            } else {
                return store.dispatch('updateResultados', true);
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