const { createApp } = Vue
const { createRouter, createWebHashHistory } = VueRouter
// createWebHistory
// createWebHashHistory

// 后端接口 URL 地址
const url = "http://192.168.0.10:8888/"

// 组件：主页
const Home = {
    template: `<div class="default">
    <div class="qrcode">
        <img src="/static/qrcode_for_weixin.jpg" alt="mini program">
        <!-- <img src="/static/qrcode_for_mini_program.jpg" alt="mini program">
        本站已发布「微信小程序」 -->
    </div>
    <div class="default_text">
        <p>欢迎使用「矿石镇的攻略百科」<br>
            如果您发现任何错误，请通过以下方式反馈。</p>
        <div class="default_icon_flex"><img class="default_icon_mini" src="/static/weibo.svg" alt="weibo"><span class="default_text_left">微博</span><a href="https://weibo.com/mineraltown" target="_blank">@矿石镇</a></div>
        <div class="default_icon_flex"><img class="default_icon_mini" src="/static/wechat.svg" alt="wechat"><span class="default_text_left">微信公众号</span>矿石镇</div>
        <div class="default_icon_flex"><img class="default_icon_mini" src="/static/bili.svg" alt="bilibili"><span class="default_text_left">哔哩哔哩</span><a href="https://space.bilibili.com/4516259" target="_blank">勤劳的牧场主</a></div>
        <div class="default_icon_flex"><img class="default_icon_mini" src="/static/mail.svg" alt="mail"><span class="default_text_left">邮箱</span>friends@mineraltown.net</div>
        <div class="default_icon_flex"><img class="default_icon_mini" src="/static/github.svg" alt="github"><span class="default_text_left">Github</span><a href="https://github.com/mineraltown/wiki" target="_blank">mineraltown/wiki</a></div>
    </div>
</div>`
}

// 组件：攻略
const Wiki = {
    data() {
        return {
            "cover": "",
            "wiki": {}
        }
    },
    mounted() {
        // 获取游戏版本【攻略内容】列表
        axios.get(url + "menu/" + this.version.index)
            .then((response) => {
                this.wiki = response.data.wiki
                this.cover = response.data.cover
            })
    },
    inject: ["version", "url"],
    template: `<div>
    <div class="cover"><img :src="cover" alt="cover"></div>
    <template v-for="item,idx in wiki">
        <div class="menu_sub" v-text="idx"></div>
        <div class="menu">
            <template v-for="i,n in item.list">
                <router-link class="item-link" v-if="'list' in i" :to="'/wiki/list/' + idx + '/' + n">
                    <div class="item">
                        <div class="item-icon"><img :src="i.icon"></div>
                        <div class="item-text" v-text="n"></div>
                    </div>
                </router-link>
                <router-link class="item-link" v-else :to="'/wiki/content/' + i.id">
                    <div class="item">
                        <div class="item-icon"><img :src="i.icon"></div>
                        <div class="item-text" v-text="n"></div>
                    </div>
                </router-link>
            </template>
        </div>
    </template>
</div>`
}

// 组件：攻略 > 内容
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
        // 通过 id 索引至文章列表
        axios.get(url + 'html/' + this.$route.params.id)
            .then((response) => {
                this.contentData = response.data
            })
    },
    template: `<div>
    <h1 class="h1" v-text="contentData.title"></h1>
    <div class="time" v-text="contentData.time"></div>
    <div class="content" v-html="contentData.text"></div>
</div>`
}

// 组件：攻略 > 内容列表
const List = {
    data() {
        return {
            "wiki": {}
        }
    },
    mounted() {
        // 获取游戏版本【攻略内容】列表
        axios.get(url + "menu/" + this.version.index)
            .then((response) => {
                this.wiki = response.data.wiki[this.$route.params.idx]["list"][this.$route.params.item]["list"]
            })
    },
    inject: ["version", "url"],
    template: `<div>
    <div class="list" v-for="item,idx in wiki">
        <router-link v-if="'id' in item" :to="'/wiki/content/' + item.id">
            <div class="list-item" v-text="idx"></div>
        </router-link>
        <router-link v-else-if="'page' in item" :to="item.page">
            <div class="list-item" v-text="idx"></div>
        </router-link>
    </div>
</div>`
}

// 组件：居民
const Resident = {
    data() {
        return {
            "resident": {}
        }
    },
    mounted() {
        // 获取游戏版本【居民】列表
        axios.get(url + this.version.index + '/resident')
            .then((response) => {
                this.resident = response.data
            })
    },
    inject: ["version", "url"],
    template: `<div><template v-for="item,idx in resident">
        <div class="menu_sub" v-text="idx"></div>
        <div class="menu-resident">
            <template v-for="i,n in item"><router-link :to="'/resident/' + n">
                    <div class="item">
                        <div class="resident-icon"><img :src="url + i.icon"></div>
                        <div class="resident-text" v-text="i.name"></div>
                    </div>
                </router-link>
            </template>
        </div>
    </template>
</div>`
}

// 模板：居民
const ResidentTemplate = {
    "saikai": `<div>
    <h1 class="h1" v-text="resident.name?.cn"></h1>
    <div class="content">
        <div v-if="resident.desc" v-html="resident.desc"></div>
        <div class="photo" v-if="resident.photo">
            <img :src="url + resident.photo" :alt="resident.name?.en">
        </div>
        <ul class="content">
            <li v-if="resident.first"><b>登场</b>：<span v-text="resident.first"></span></li>
            <li v-if="resident.address"><b>住所</b>：<span v-text="resident.address"></span></li>
            <li v-if="resident.sex"><b>性别</b>：<span v-text="resident.sex"></span></li>
            <li v-if="resident.birth">
                <b>生日</b>：<span v-text="resident.birth?.month"></span>
                <span v-text="resident.birth?.day"></span>日
                <template v-if="resident.birth?.another">（
                    <span v-text="resident.birth?.month"></span>
                    <span v-text="resident.birth?.another"></span>日）
                </template>
            </li>
            <li v-if="resident.family"><b>家庭成员</b>：<span v-text="resident.family"></span></li>
        </ul>
        <template v-if="resident.like">
            <h2>喜欢与讨厌的物品</h2>
            <ul v-for="x,y in resident.like">
                <li><b v-text="y"></b>：<template v-for="(z, i) in x" :key="i"><span v-text="z"></span>
                        <span v-if="i < x.length - 1">、</span></template></li>
            </ul>
        </template>
        <template v-if="resident.trip">
            <h2>行程</h2>
            <div v-html="resident.trip"></div>
        </template>
        <div v-if="resident.note" v-html="resident.note"></div>
    </div>
</div>`
}

// 组件：居民 > 内容
const ResidentContent = {
    data() {
        return {
            "resident": {}
        }
    },
    mounted() {
        // 获取游戏版本【居民】内容
        axios.get(url + this.version.index + '/resident/' + this.$route.params.name)
            .then((response) => {
                this.resident = response.data
            })
    },
    inject: ["version", "url"],
    template: ResidentTemplate[localStorage.getItem('version')]
}

// 组件：提醒 > 未定义
const ToDo = {
    inject: ["version"],
    data() {
        return {
        }
    },
    template: `<div class="todo_none">暂时无法使用该功能</div>`
}

// 组件：提醒 > 重聚矿石镇
const ToDo_saikai = {
    inject: ["version"],
    data() {
        return {
            season: [
                ["spring", "春"],
                ["summer", "夏"],
                ["autumn", "秋"],
                ["winter", "冬"],
            ],
            week: ["日", "一", "二", "三", "四", "五", "六"],
            year: 1,  // 年
            month: 0,  // 月（0-3）
            day: 1,  // 日（1-30）
            advance_day: 3,  // 提前提醒天数
            name: "",  // 昵称
            birthday_month: 0,  // 生日（月）
            birthday_day: 1,  // 生日（日）
            cookbook: [],  // 电视料理菜谱
            resident: [],  // 居民生日
            festival: [],  // 节日
        }
    },
    methods: {
        // 通过年月日计算是周几
        get_week() {
            return ((this.year - 1) * 120 + this.month * 30 + this.day - 1) % 7
        },
        // 日历（当周）
        get_calendar() {
            let ThisWeek = []
            let today = this.get_week()
            // 当天之前（不含当天）
            for (let i = today; i > 0; i--) {
                let d = this.day - i
                if (d <= 0) {
                    ThisWeek.push([this.month - 1, 30 + d])
                } else {
                    ThisWeek.push([this.month, d])
                }
            }
            // 当天之后（含当天）
            for (let i = today; i < 7; i++) {
                let d = this.day + (i - today)
                if (d > 30) {
                    ThisWeek.push([this.month + 1, d - 30])
                } else {
                    ThisWeek.push([this.month, d])
                }
            }
            // 如果出现'-1'或'4'则重置为'3'或'0'
            for (let x of ThisWeek) {
                if (x[0] > 3) {
                    x[0] = 0
                } else if (x[0] < 0) {
                    x[0] = 3
                }
            }
            // 循环日历列表（周），通过月份和日期添加事件名
            for (let x of ThisWeek) {
                z = []
                // 日历事件
                for (let y of this.festival) {
                    if (this.season[x[0]][1] == y.month && x[1] == y.day) {
                        z.push(y.name.cn)
                    }
                }
                // 居民生日
                for (let y of this.resident) {
                    if (this.season[x[0]][1] == y.birthday.month && x[1] == y.birthday.day) {
                        z.push(y.name.cn)
                    }
                }
                x.push(z)
            }
            // 返回值 [[<月>,<日>,<节日/生日>],...]
            return ThisWeek
        },
        // 导入JSON格式游戏数据
        import_data() {
            // 居民信息
            axios.get("/todo/saikai/Resident.json").then((response) => {
                for (i in response.data) {
                    // 如果生日和候补生日重复，则替换为备选生日日期
                    if (response.data[i]["birthday"]["month"] == this.season[this.birthday_month][1]) {
                        if (response.data[i]["birthday"]["day"] == this.birthday_day) {
                            if (response.data[i]["birthday"]["day2"] != null) {
                                response.data[i]["birthday"]["day"] =
                                    response.data[i]["birthday"]["day2"]
                            }
                        }
                    }
                }
                this.resident = response.data
            })
            // 节日信息
            axios.get("/todo/saikai/Festival.json").then((response) => {
                this.festival = response.data
            })
            // 电视料理菜谱
            axios.get("/todo/saikai/Cookbook.json").then((response) => {
                this.cookbook = response.data
            })
        },
        // 下个月
        next_month() {
            // 如果这个月是冬，下一个月则是春。
            let n
            if (this.month == 3) {
                n = 0
            } else {
                n = this.month + 1
            }
            return n
        },
        // 生日：是否在n天之内举行
        test_birthday(i, n) {
            let next = this.next_month()
            if (i.birthday.month == this.season[this.month][1]) {
                // 判断生日月份是否在当前月份
                if (i.birthday.day - this.day == n) {
                    return true
                } else {
                    return false
                }
            } else if (i.birthday.month == this.season[next][1]) {
                // 或者下个月
                if (i.birthday.day + 30 - this.day == n) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        // 节日：是否在n天之内举行
        test_festival(i, n) {
            let next = this.next_month()
            if (i.month == this.season[this.month][1]) {
                // 判断节日月份是否在当前月份
                if (i.day - this.day == n) {
                    return true
                } else {
                    return false
                }
            } else if (i.month == this.season[next][1]) {
                // 或者下个月
                if (i.day + 30 - this.day == n) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        // 判断是否是节日
        if_festival() {
            // 商店在节日时休息
            let f = this.festival
            for (i in f) {
                if (this.day == f[i].day && this.season[this.month][1] == f[i].month) {
                    if (
                        // 无固定场所的节日商店不休息
                        f[i].name.cn == "春季感恩节" ||
                        f[i].name.cn == "南瓜节" ||
                        f[i].name.cn == "冬季感恩节"
                    ) {
                        return false
                    } else if (this.year == 1 && this.month == 0 && this.day == 1) {
                        // 第一年春1日的年糕大会不举行
                        return false
                    } else {
                        return true
                    }
                }
            }
            return false
        },
        // 初始化
        reset(e) {
            console.log("初始化")
            var d = {
                "year": 1,
                "month": 0,
                "day": 1,
                "advance_day": 3,
                "name": "",
                "birthday_month": 0,
                "birthday_day": 1,
            }
            localStorage.setItem(e, JSON.stringify(d))
            this.localStorage_to_data(e)
        },
        // 从 localStorage 写入 data
        localStorage_to_data(e) {
            var d = JSON.parse(localStorage.getItem(e))
            this.year = parseInt(d["year"])
            this.month = parseInt(d["month"])
            this.day = parseInt(d["day"])
            this.advance_day = parseInt(d["advance_day"])
            this.name = d["name"]
            this.birthday_month = parseInt(d["birthday_month"])
            this.birthday_day = parseInt(d["birthday_day"])
        },
        // 从 data 写入 localStorage
        data_to_localStorage(e) {
            var d = {
                "year": this.year,
                "month": this.month,
                "day": this.day,
                "advance_day": this.advance_day,
                "name": this.name,
                "birthday_month": this.birthday_month,
                "birthday_day": this.birthday_day,
            }
            localStorage.setItem(e, JSON.stringify(d))
        },
        // 下一天
        next() {
            // 日期 +1
            if (this.day + 1 <= 30) {
                this.day += 1
            } else {
                this.day = 1
                if (this.month + 1 < 4) {
                    this.month += 1
                } else {
                    this.month = 0
                    this.year += 1
                }
            }
            console.log('第' + this.year + '年 ' + this.season[this.month][1] + this.day + '日 星期' + this.week[this.get_week()])
            // 存档
            this.data_to_localStorage(this.version.index)
        }
    },
    created() {
        // 导入JSON格式游戏数据
        this.import_data()
        // 导入本地存储的存档数据，无数据则初始化
        if (localStorage.getItem(this.version.index)) {
            this.localStorage_to_data(this.version.index)
        } else {
            this.reset(this.version.index)
        }
    },
    template: `<div class="todo">
    <div class="todo_shop">
        <div :class="get_week()==4 || if_festival() ? 'todo_shop_holiday' : 'todo_shop_working'">铁匠铺</div>
        <div :class="get_week()==0 || if_festival() ? 'todo_shop_holiday' : 'todo_shop_working'">养鸡场</div>
        <div :class="get_week()==1 || if_festival() ? 'todo_shop_holiday' : 'todo_shop_working'">约德尔牧场</div>
        <div :class="get_week()==6 || if_festival() ? 'todo_shop_holiday' : 'todo_shop_working'">果树园</div>
        <div :class="if_festival() ? 'todo_shop_holiday' : 'todo_shop_working'">旅馆</div>
        <div :class="get_week()==1 || if_festival() ? 'todo_shop_holiday' : 'todo_shop_working'">图书馆</div>
        <div :class="get_week()==0 || get_week()==2 || if_festival() ? 'todo_shop_holiday' : 'todo_shop_working'">杂货店</div>
        <div :class="get_week()==3 || if_festival() ? 'todo_shop_holiday' : 'todo_shop_working'">医院</div>
        <div :class="get_week()==1&&!if_festival() || get_week()==3 && !if_festival() ? 'todo_shop_working' : 'todo_shop_holiday'">教堂</div>
        <div :class="get_week()==6 || if_festival() ? 'todo_shop_holiday' : 'todo_shop_working'">伐木之家</div>
        <div :class="if_festival() ? 'todo_shop_holiday' : 'todo_shop_working'">霍安的店</div>
        <div :class="get_week()!=0 && month==1 && !if_festival() ? 'todo_shop_working' : 'todo_shop_holiday'">海之家</div>
        <div :class="get_week()==3 && !if_festival() ? 'todo_shop_working' : 'todo_shop_holiday'">班的店</div>
        <div :class="day==15 && !if_festival() ? 'todo_shop_working_red' : 'todo_shop_holiday'">宠物店</div>
    </div>
    <div class="todo_season">
        <div class="todo_season_date">日期</div>
        <div>第&nbsp;<span v-text="year"></span>&nbsp;年</div>
        <div class="todo_season_moon" v-text="season[month][1]"></div>
    </div>
    <div class="todo_calendar"><template v-for="i,n in get_calendar()" :key="n">
            <div class="todo_calendar_days" :class="i[1] != day ? '' : 'todo_calendar_this'" @click="month=i[0];day=i[1];data_to_localStorage(version.index)">
                <div class="todo_calendar_week" v-text="week[n]"></div>
                <div class="todo_calendar_day">
                    <div class="todo_calendar_num" v-text="i[1]"></div>
                    <div class="todo_calendar_event" v-for="z in i[2]" v-text="z"></div>
                </div>
            </div>
        </template></div>
    <div class="todo_card_list">
        <div class="todo_card wool" v-if="month==2 && day==14">
            <div class="todo_flex">答应我，准备参加参加软绵绵节的动物，从今天开始就不要剪毛了好吗？</div>
        </div>
        <div class="todo_card wool" v-if="day==15">
            <div class="todo_flex">
                <div class="todo_title">宠物店</div>
                <div class="bold">地点：<span class="normal">广场</span></div>
                <div class="bold">时间：<span class="normal">PM6:00 ～ AM6:00</span></div>
                <div class="bold">种类：
                    <span class="normal" v-if="month==0">猫</span>
                    <span class="normal" v-else-if="month==1">企鹅</span>
                    <span class="normal" v-else-if="month==2">狗</span>
                    <span class="normal" v-else-if="month==3">水豚</span>
                </div>
            </div>
        </div>
        <div class="todo_card wool" v-if="year%5==0 && month==2 && day==10">
            <div class="todo_flex">
                <div class="todo_title">流星</div>
                <div class="bold">地点：<span class="normal">山顶</span></div>
                <div class="bold">时间：<span class="normal">PM6:00 ～ AM6:00</span></div>
            </div>
        </div>
        <template v-for="i in cookbook">
            <template v-if="i.year==year && i.month==season[month][1] && i.day==day">
                <div class="todo_card todo_card_today">
                    <div class="todo_flex">
                        <div class="todo_title" v-text="i.name"></div>
                        <div>记得看电视节目「<span v-text="i.note"></span>」！</div>
                    </div>
                </div>
            </template>
        </template>
        <div class="todo_card todo_card_today" v-if="name!='' && birthday_month==month && birthday_day==day">
            <div class="todo_flex">
                <div class="todo_title" v-text="name"></div>
                <div class="bold">今天是你的生日，祝你生日快乐！</div>
                <div class="todo_note">“对所有的烦恼说 Bye Bye，对所有的快乐说 Hi Hi”</div>
            </div>
        </div>
        <template v-for="i in festival">
            <template v-if="i.month==season[month][1] && i.day==day">
                <div class="todo_card todo_card_today" v-if="!(year==1 && i.name.cn=='年糕大会')">
                    <div class="todo_flex">
                        <div class="todo_title" v-text="i.name.cn"></div>
                        <template v-if="i.address!=null">
                            <div class="bold">地点：<span class="normal" v-text="i.address"></span></div>
                            <div class="bold">时间：<span class="normal" v-text="i.start_time + ' ～ ' + i.end_time"></span></div>
                        </template>
                        <template v-else>
                            <div class="bold">时间：<span class="normal">全天</span></div>
                        </template>
                        <template v-if="i.note!=null">
                            <div v-html="i.note"></div>
                        </template>
                    </div>
                </div>
            </template>
        </template>
        <template v-for="i in resident">
            <template v-if="i.birthday.month==season[month][1] && i.birthday.day==day">
                <div class="todo_card todo_card_today">
                    <div class="todo_flex">
                        <div class="todo_title" v-text="i.name.cn"></div>
                        <div class="bold" v-if="i.like.best.length!=0">最喜欢</div>
                        <div v-if="i.like.best.length!=0">
                            <template v-for="(x,y) in i.like.best">
                                <span v-if="y<i.like.best.length-1" v-text="x+'、'"></span>
                                <span v-else v-text="x"></span>
                            </template>
                        </div>
                        <div class="bold">喜欢</div>
                        <div>
                            <template v-for="(x,y) in i.like.more">
                                <span v-if="y<i.like.more.length-1" v-text="x+'、'"></span>
                                <span v-else v-text="x"></span>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </template>
        <template v-if="advance_day!=0">
            <template v-for="n in advance_day">
                <template v-for="i in festival">
                    <template v-if="test_festival(i,n)">
                        <div class="todo_card">
                            <div class="todo_advance_days">
                                <span v-text="i.month"></span>
                                <span v-text="i.day"></span>日
                            </div>
                            <div class="todo_flex">
                                <div class="gray">
                                    <span class="todo_title" v-text="i.name.cn"></span>
                                    <span class="todo_note">距离
                                        <span v-text="i.name.cn"></span>还有
                                        <span v-text="n"></span>天<br>
                                        <span v-if="i.name.cn=='软绵绵节'" class="warning">（不要剪羊毛了！）</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <template v-for="i in resident">
                    <template v-if="test_birthday(i,n)">
                        <div class="todo_card">
                            <div class="todo_advance_days">
                                <span v-text="i.birthday.month"></span>
                                <span v-text="i.birthday.day"></span>日
                            </div>
                            <div class="todo_flex">
                                <div class="gray">
                                    <span class="todo_title" v-text="i.name.cn"></span>
                                    <span class="todo_note">距离生日还有<span v-text="n"></span>天</span>
                                </div>
                                <div class="gray bold" v-if="i.like.best.length!=0">最喜欢</div>
                                <div class="gray" v-if="i.like.best.length!=0">
                                    <template v-for="(x,y) in i.like.best">
                                        <span v-if="y<i.like.best.length-1" v-text="x+'、'"></span>
                                        <span v-else v-text="x"></span>
                                    </template>
                                </div>
                                <div class="gray bold">喜欢</div>
                                <div class="birthday_like gray">
                                    <template v-for="(x,y) in i.like.more">
                                        <span v-if="y<i.like.more.length-1" v-text="x+'、'"></span>
                                        <span v-else v-text="x"></span>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
            </template>
        </template>
    </div>
    <div class="todo_spacing"></div>
    <div class="todo_next">
        <div class="next_button" @click="next()">下一天</div>
    </div>
</div>`
}

// 组件：设置
const Setting = {
    inject: ["version"],
    data() {
        return {
            season: {
                "saikai": [["春", "夏", "秋", "冬"], 30],
                "grabaza": [["春", "夏", "秋", "冬"], 31],
                "welcome": [["郁金香", "胡椒", "琥珀", "靛蓝"], 10],
            },
            year: 1,  // 年
            month: 0,  // 月（0-3）
            day: 1,  // 日（1-30）
            advance_day: 3,  // 提前提醒天数
            name: "",  // 昵称
            birthday_month: 0,  // 生日（月）
            birthday_day: 1,  // 生日（日）
            set_name: false,
            set_days: false,
        }
    },
    methods: {
        // 切换游戏版本
        pick() {
            let that = this
            let p = []
            for (let i in that.version.dict) {
                if (i in that.season) {
                    p.push({
                        label: that.version.dict[i],
                        value: i,
                    })
                }
            }
            weui.picker(p, {
                // 默认值
                defaultValue: [that.version.index],
                // 修改时触发
                // onChange: function (result) {
                //     console.log(result)
                // },
                // 点击确认触发
                onConfirm: function (result) {
                    that.version.index = result[0].value
                    localStorage.setItem('version', that.version.index)
                },
                // 为组件添加一个id
                id: 'setting_pick'
            })
        },
        // 修改姓名
        change_name(e) {
            this.name = e.target.value
            this.data_to_localStorage(this.version.index)
        },
        // 修改生日
        birthday() {
            let that = this
            // 季节
            let season = Array.from({ length: this.season[this.version.index][0].length }, (_, index) => ({ label: `${this.season[this.version.index][0][index]}`, value: index }))
            // 每月天数
            let day = Array.from({ length: this.season[this.version.index][1] }, (_, index) => ({ label: `${index + 1}`, value: index + 1 }))
            weui.picker(season, day, {
                defaultValue: [that.birthday_month, that.birthday_day],
                onConfirm: function (result) {
                    that.birthday_month = result[0].value
                    that.birthday_day = result[1].value
                    that.data_to_localStorage(that.version.index)
                },
                id: 'setting_birthday'
            })
        },
        // 提前提醒天数
        advance() {
            let that = this
            let p = []
            for (let i = 0; i <= 7; i++) {
                if (i == 0) {
                    p.push({
                        label: '不提醒',
                        value: i,
                    })
                } else {
                    p.push({
                        label: i + ' 天',
                        value: i,
                    })
                }
            }
            weui.picker(p, {
                defaultValue: [that.advance_day],
                onConfirm: function (result) {
                    that.advance_day = result[0].value
                    that.data_to_localStorage(that.version.index)
                },
                id: 'setting_advance'
            })
        },
        // 初始化
        reset(e) {
            console.log("初始化")
            var d = {
                "year": 1,
                "month": 0,
                "day": 1,
                "advance_day": 3,
                "name": "",
                "birthday_month": 0,
                "birthday_day": 1,
            }
            localStorage.setItem(e, JSON.stringify(d))
            this.localStorage_to_data(e)
        },
        // 从 localStorage 写入 data
        localStorage_to_data(e) {
            var d = JSON.parse(localStorage.getItem(e))
            this.year = parseInt(d["year"])
            this.month = parseInt(d["month"])
            this.day = parseInt(d["day"])
            this.advance_day = parseInt(d["advance_day"])
            this.name = d["name"]
            this.birthday_month = parseInt(d["birthday_month"])
            this.birthday_day = parseInt(d["birthday_day"])
        },
        // 从 data 写入 localStorage
        data_to_localStorage(e) {
            var d = {
                "year": this.year,
                "month": this.month,
                "day": this.day,
                "advance_day": this.advance_day,
                "name": this.name,
                "birthday_month": this.birthday_month,
                "birthday_day": this.birthday_day,
            }
            localStorage.setItem(e, JSON.stringify(d))
        },
        // 修改年份
        change_year(e) {
            // input
            const INT = new RegExp("^[1-9][0-9]*$")
            if (e.target.value == "") {
                this.year = 1
            } else if (INT.test(e.target.value)) {
                this.year = parseInt(e.target.value)
            } else {
                e.target.value = parseInt(this.year)
            }
            this.data_to_localStorage(this.version.index)
        },
        switch_year(i) {
            // button
            if (i == "add") {
                this.year += 1
            } else if (i == "sub") {
                if (this.year > 1) {
                    this.year = parseInt(this.year) - 1
                }
            }
            this.data_to_localStorage(this.version.index)
        },
        // 修改季节
        switch_month(i) {
            this.month = parseInt(i)
            this.data_to_localStorage(this.version.index)
        },
        // 修改天数
        change_day(e) {
            // input
            const INT = new RegExp("^[1-9][0-9]*$")
            if (e.target.value == "") {
                this.day = 1
            } else if (INT.test(e.target.value)) {
                if (e.target.value > this.season[this.version.index][1]) {
                    this.day = 1
                } else if (e.target.value < 1) {
                    this.day = 1
                } else {
                    this.day = parseInt(e.target.value)
                }
            } else {
                e.target.value = parseInt(this.day)
            }
            this.data_to_localStorage(this.version.index)
        },
        switch_day(i) {
            // button
            if (i == "add") {
                if (this.day + 1 <= this.season[this.version.index][1]) {
                    this.day += 1
                } else {
                    this.day = 1
                }
            } else if (i == "sub") {
                if (this.day - 1 < 1) {
                    this.day = this.season[this.version.index][1]
                } else {
                    this.day -= 1
                }
            }
            this.data_to_localStorage(this.version.index)
        },
    },
    mounted() {
        // 导入本地存储的存档数据，无数据则初始化
        if (localStorage.getItem(this.version.index)) {
            this.localStorage_to_data(this.version.index)
        } else {
            this.reset(this.version.index)
        }
    },
    template: `<div class="setting">
    <div class="setting_sub">设置</div>
    <div class="list">
        <list-item title="切换游戏版本" :sub="version.dict[version.index]" @click="pick()" />
        <div class="setting_sub">提醒</div>
        <list-item title="昵称" :arrow="!set_name" :sub="!set_name?name:''" @click="set_name=true" />
        <div v-show="set_name" class="setting_name">
            <input type="text" :value="name" @input="change_name">
            <div class="setting_button" @click="set_name=false">确认</div>
        </div>
        <list-item title="生日" :sub="season[version.index][0][birthday_month]  + '&nbsp;' + birthday_day + '&nbsp;日'"
            @click="birthday()" />
        <list-item title="游戏时间" :arrow="!set_days" @click="set_days=true"
            :sub="!set_days?'第&nbsp;' + year  + '&nbsp;年&nbsp;' + season[version.index][0][month] + '&nbsp;' + day + '&nbsp;日':''" />
        <div v-show="set_days" class="setting_days">
            <div class="setting_block">
                <span class="setting_block_sub">年</span>
                <div class="setting_season">
                    <div class="setting_arrow" @click="switch_year('sub')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M8 12l6-6v12z" fill="rgba(255,255,255,1)" />
                        </svg>
                    </div>
                    <div class="setting_text">
                        <input type="text" :value="year" @input="change_year">
                    </div>
                    <div class="setting_arrow" @click="switch_year('add')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M16 12l-6 6V6z" fill="rgba(255,255,255,1)" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="setting_block">
                <span class="setting_block_sub">月</span>
                <div class="setting_season">
                    <div v-for="i,s in season[version.index][0]"
                        :class="[s==month ? 'season_'+s : 'none_'+s, 'season_month']" @click="switch_month(s)"
                        v-text="i">
                    </div>
                </div>
            </div>
            <div class="setting_block">
                <span class="setting_block_sub">日</span>
                <div class="setting_season">
                    <div class="setting_arrow" @click="switch_day('sub')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M8 12l6-6v12z" fill="rgba(255,255,255,1)" />
                        </svg>
                    </div>
                    <div class="setting_text">
                        <input type="text" :value="day" @input.native="change_day($event)">
                    </div>
                    <div class="setting_arrow" @click="switch_day('add')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M16 12l-6 6V6z" fill="rgba(255,255,255,1)" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="setting_block">
                <span class="flex_grow">
                </span>
                <div class="setting_button" @click="set_days=false">确认</div>
            </div>
        </div>
        <list-item title="提前提醒天数" :sub="advance_day==0 ? '不提醒' : advance_day + ' 天'" @click="advance()" />
    </div>
    <div class="copyright">
        <div>矿石镇的攻略百科 &copy; 2015-<span v-text="new Date().getFullYear()">
            </span>
        </div>
    </div>
</div>`
}

// 定义路由
const routes = [
    { path: '/', component: Home },
    { path: '/wiki', component: Wiki },
    { path: '/wiki/content/:id', component: Content, props: true },
    { path: '/wiki/list/:idx/:item', component: List, props: true },
    { path: '/resident', component: Resident },
    { path: '/resident/:name', component: ResidentContent, props: true },
    { path: '/todo/saikai', component: ToDo_saikai, props: true },
    { path: '/todo/:ver', component: ToDo },
    { path: '/setting', component: Setting },
]

// 创建路由器实例
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 创建 Vue 应用
const app = createApp({
    // 用于声明组件初始响应式状态的函数。
    data() {
        return {
            "url": url,
            "version": {
                "index": "saikai",  // 当前版本
                "dict": {},  // 版本列表
            },
        }
    },
    // 用于提供可以被后代组件注入的值。
    provide() {
        return {
            version: this.version,
            url: this.url,
        }
    },
    // 用于声明要混入到组件实例中的方法。
    methods: {
        // 路由：检测路径中有几个 '/' 则出现
        hasMultipleSlashes() {
            if (this.$route.path.includes('todo')) {
                return (this.$route.path.match(/\//g) || []).length > 2
            } else {
                return (this.$route.path.match(/\//g) || []).length > 1
            }
        },
        // 路由：返回
        goBack() {
            this.$router.go(-1)
        },
    },
    // 在组件实例处理完所有与状态相关的选项后调用。
    created() {
        // 游戏版本：如果本地存储 localStorage 是空着的，则进行初始化操作，否则读取数据
        let version = localStorage.getItem('version')
        if (version == null) {
            localStorage.setItem('version', this.version.index)
        } else {
            this.version.index = version
        }
    },
    // 在组件被挂载之后调用。
    mounted() {
        // 获取【游戏版本】列表
        axios.get(url + 'menu/')
            .then((response) => {
                this.version.dict = response.data
            })
    }
})

// 安装路由插件 (vue-router)
app.use(router)

// 注册全局组件
// <list-item title="" :sub="" arrow="false" @click="" />
app.component("list-item", {
    props: {
        "title": String,
        "sub": String,
        "arrow": {
            type: Boolean,
            default: true
        }
    },
    template: `<div class="list-item">
    <div class="list-item-title" v-text="title"></div>
    <div class="list-item-sub" v-text="sub"></div>
    <div class="list-item-svg" v-show="arrow">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
        </svg>
    </div>
</div>`
})

// 将应用实例挂载在容器元素中
const vm = app.mount('#wiki')
