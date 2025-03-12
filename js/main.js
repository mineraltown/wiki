const { createApp } = Vue
const { createRouter, createWebHashHistory } = VueRouter
// createWebHistory
// createWebHashHistory

const url = "http://localhost:8888/"

// 定义组件
const Home = {
    template: '<div>{{ $route }}</div>'
}
const Wiki = {
    data() {
        return {
            "cover": "",
            "wiki": {}
        }
    },
    mounted() {
        axios.get(url + "menu/" + this.version.index)
            .then((response) => {
                this.wiki = response.data.wiki
                this.cover = url + response.data.cover
            })
    },
    inject: ["version"],
    template: '<div class="main"><div class="cover"><img :src="cover" alt="cover"></div><template v-for="item,idx in wiki"><div class="setting_sub" v-text="idx"></div><div class="menu"><router-link class="item-link" v-for="i in item" :to="\'/wiki/content/\' + version.index + \'/\' + i.id "><div class="item"><div class="item-icon"><img :src="i.icon"></div><div class="item-text" v-text="i.title"></div></div></router-link></div></template></div>'
}

const Content = {
    data() {
        return {
            contentData: {
                title: "",
                time: "",
                text: ""
            }
        }
    },
    mounted() {
        axios.get(url + 'html/' + this.$route.params.id)
            .then((response) => {
                this.contentData = response.data
            })
        console.log(this.contentData)
    },
    template: '<div><h1 v-text="contentData.title"></h1><div class="time" v-text="contentData.time"></div><div v-html="contentData.text"></div></div>'
}

const Resident = {
    template: '<div>{{ $route }}</div>'
}
const ToDo = {
    template: '<div>{{ $route }}</div>'
}

const Setting = {
    inject: ["version"],
    methods: {
        pick() {
            let that = this
            let p = []
            for (let i in that.version.dict) {
                p.push({
                    label: that.version.dict[i],
                    value: i,
                })
            }
            weui.picker(p, {
                className: 'custom-classname',
                container: 'body',
                defaultValue: [that.version.index],
                // onChange: function (result) {
                //     console.log(result)
                // },
                onConfirm: function (result) {
                    that.version.index = result[0].value
                    localStorage.setItem('version', that.version.index)
                },
                id: 'singleLinePicker'
            })
        }
    },
    template: '<div><div class="setting_sub">设置</div><div class="list"><list-item title="切换游戏版本" :sub="version.dict[version.index]" @click="pick()" /></div></div>'
}

// 定义路由
const routes = [
    { path: '/', component: Home },
    { path: '/wiki', component: Wiki },
    { path: '/resident', component: Resident },
    { path: '/todo', component: ToDo },
    { path: '/setting', component: Setting },
    { path: '/wiki/content/:version/:id', component: Content, props: true }
]

// 创建路由器实例
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 创建 Vue 应用
const app = createApp({
    data() {
        return {
            "version": {
                "index": "saikai",
                "dict": {},
            }
        }
    },
    provide() {
        return {
            version: this.version,
        }
    },
    methods: {
        hasMultipleSlashes() {
            let a = (this.$route.path.match(/\//g) || []).length > 1
            return a
        },
        goBack() {
            this.$router.go(-1)
        },

    },
    created() {
        let version = localStorage.getItem('version')
        if (version == null) {
            localStorage.setItem('version', this.version.index)
        } else {
            this.version.index = version
        }
    },
    mounted() {
        axios.get(url + 'menu/')
            .then((response) => {
                this.version.dict = response.data
            })
    }
})

app.use(router)
app.component("list-item", {
    props: {
        "title": String,
        "sub": String
    },
    template: '<div class="list-item"><div class="list-item-title" v-text="title"></div><div class="list-item-sub" v-text="sub"></div><div class="list-item-svg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg></div></div>'
})
app.mount('#wiki')
