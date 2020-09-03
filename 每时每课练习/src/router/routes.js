const routes = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/index',
        name: 'Index',
        component: () =>
            import('../views/index/Index.vue'),
        meta: {
            footer: true,
            title: 'vue'
        }
    },
    {
        path: '/oto',
        name: 'Oto',
        component: () =>
            import('../views/index/oto/Oto.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/oto-plan',
        name: 'OtoPlan',
        component: () =>
            import('../views/index/oto/OtoPlan.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/teacher',
        name: 'Teacher',
        component: () =>
            import('../views/index/teacher/Teacher.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/comments',
        name: 'CommentItem',
        component: () =>
            import('../components/CommentItem.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/course',
        name: 'Course',
        component: () =>
            import('../views/course/Course.vue'),
        meta: {
            footer: true,
            title: 'vue'
        }
    },
    {
        path: '/search',
        name: 'Search',
        component: () =>
            import('../views/course/Search.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/course-detail',
        name: 'CourseDetail',
        component: () =>
            import('../views/course/CourseDetail.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/purchase',
        name: 'Purchase',
        component: () =>
            import('../views/course/Purchase.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/pay',
        name: 'Pay',
        component: () =>
            import('../views/course/Pay.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/record',
        name: 'Record',
        component: () =>
            import('../views/record/Record.vue'),
        meta: {
            footer: true,
            title: 'vue'
        }
    },
    {
        path: '/communicate',
        name: 'Communicate',
        component: () =>
            import('../views/record/Communicate.vue'),
        meta: {
            title: 'vue'
        }
    },
    /** 
     * 讲师端
     */
     {
         path:"/person",
         name:"Person",
         component:()=>import("../views/person/Person.vue"),
         meta: {
            footer: true,
            title: 'vue'
        }
     },
    {
        path: '/vip',
        name: 'Vip',
        component: () =>
            import('../views/person/Vip.vue'),
        meta: {
            title: 'vue'
        },
    },
     {
        path: '/protocol_01',
        name: 'protocol_01',
        component: () =>
            import('../views/person/protocol_01.vue'),
        meta: {
            title: 'vue'
        },
    },
     {
        path: '/protocol_02',
        name: 'protocol_02',
        component: () =>
            import('../views/person/protocol_02.vue'),
        meta: {
            title: 'vue'
        },
    },
     {
        path: '/protocol_03',
        name: 'protocol_03',
        component: () =>
            import('../views/person/protocol_03.vue'),
        meta: {
            title: 'vue'
        },
    },
    {
        path: '/my-study',
        name: 'MyStudy',
        component: () =>
            import('../views/person/mine/MyStudy.vue'),
        meta: {
            title: 'vue'
        },
    },
    {
        path: '/study-detail',
        name: 'MyStudyDetail',
        component: () =>
            import('../views/person/mine/MyStudyDetail.vue'),
        meta: {
            title: 'vue'
        },
    },
    {
        path: '/picture-course-detail',
        name: 'PictureCourseDetail',
        component: () =>
            import('../views/person/mine/PictureCourseDetail.vue'),
        meta: {
            title: 'vue'
        },
    },
    {
        path: '/study-calendar',
        name: 'StudyCalendar',
        component: () =>
            import('../views/person/mine/StudyCalendar.vue'),
        meta: {
            title: 'vue'
        },
    },
    {
        path: '/my-currency',
        name: 'MyCurrency',
        component: () =>
            import('../views/person/mine/MyCurrency.vue'),
        meta: {
            title: 'vue'
        },
    },
    {
        path: '/ios-currency',
        name: 'IosCurrency',
        component: () =>
            import('../views/person/mine/IosCurrency.vue'),
        meta: {
            title: 'vue'
        },
    },
    {
        path: '/my-currency-detail',
        name: 'MyCurrencyDetail',
        component: () =>
            import('../views/person/mine/MyCurrencyDetail.vue'),
        meta: {
            title: 'vue'
        },
    },
    {
        path: '/my-currency-recharge',
        name: 'MyCurrencyRecharge',
        component: () =>
            import('../views/person/mine/MyCurrencyRecharge.vue'),
        meta: {
            title: 'vue'
        },
    },
    {
        path: '/concern',
        name: 'Concern',
        component: () =>
            import('../views/person/Concern.vue'),
        meta: {
            title: 'vue'
        },
    },
    {
        path: '/collect',
        name: 'Collect',
        component: () =>
            import('../views/person/Collect.vue'),
        meta: {
            title: 'vue'
        },
    },
    {
        path: '/order',
        name: 'Order',
        component: () =>
            import('../views/person/order/Order.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/order-detail',
        name: 'OrderDetail',
        component: () =>
            import('../views/person/order/OrderDetail.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/coupon',
        name: 'Coupon',
        component: () =>
            import('../views/person/Coupon.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/card',
        name: 'Card',
        component: () =>
            import('../views/person/card/Card.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/exchange',
        name: 'Exchange',
        component: () =>
            import('../views/person/card/Exchange.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/message',
        name: 'Message',
        component: () =>
            import('../views/person/message/Message.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/message-detail',
        name: 'MessageDetail',
        component: () =>
            import('../views/person/message/MessageDetail.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/options',
        name: 'Options',
        component: () =>
            import('../views/person/Options.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/feedback',
        name: 'Feedback',
        component: () =>
            import('../views/person/Feedback.vue'),
        meta: {
            title: 'vue'
        }
    },
    {
        path: '/set-new-pass',
        name: 'SetNewPass',
        component: () =>
            import('../views/login/ForgetPass.vue'),
        meta: {
            title: 'vue'
        }
    },
    /**
     * 登录设置
     * */
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import('../views/login/Login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/sms-login',
        name: 'SmsLogin',
        component: () =>
            import('../views/login/SmsLogin.vue'),
        meta: {
            title: '验证码登录'
        }
    },
    {
        path: '/forget-pass',
        name: 'ForgetPass',
        component: () =>
            import('../views/login/ForgetPass.vue'),
        meta: {
            title: '忘记密码'
        }
    },
    {
        path: '/bind-mobile',
        name: 'BindMobile',
        component: () =>
            import('../views/login/BindMobile.vue'),
        meta: {
            title: '绑定手机号'
        }
    },
    {
        path: '/set-pass',
        name: 'SetPass',
        component: () =>
            import('../views/login/SetPass.vue'),
        meta: {
            title: '设置密码'
        }
    },
    {
        path: '/set-message',
        name: 'SetMessage',
        component: () =>
            import('../views/login/SetMessage.vue'),
        meta: {
            title: '信息填写'
        }
    },
   
    /** */
   
	/**
     * 题库
     *  */
    {
        path: '/practise',
        name: 'Practise',
        component: () =>
            import('../views/question/Index.vue'),
        meta: {
            footer: true,
            title: '练习',

        }
    },
    {
        path: '/paper-package',
        name: 'PaperPackage',
        component: () =>
            import('../views/question/PaperPackage.vue'),
        meta: {
            title: '套卷练习',

        }
    },
    {
        path: '/ques',
        name: 'Ques',
        component: () =>
            import('../views/question/Question.vue'),
        meta: {
            title: '做题',
        }
    },
    {
        path: '/result',
        name: 'Result',
        component: () =>
            import('../views/question/Result.vue'),
        meta: {
            title: '成绩统计',
        }
    },
    {
        path: '/exam',
        name: 'Exam',
        component: () =>
            import('../views/question/Exam.vue'),
        meta: {
            title: '仿真模考',
        }
    },
    {
        path: '/assess',
        name: 'Assess',
        component: () =>
            import('../views/question/Assess.vue'),
        meta: {
            title: '测评记录',
        }
    },
    {
        path: '/error-ques',
        name: 'ErrorQues',
        component: () =>
            import('../views/question/ErrorQues.vue'),
        meta: {
            title: '错题记录',
        }
    },
    {
        path: '/error-list',
        name: 'ErrorList',
        component: () =>
            import('../views/question/ErrorList.vue'),
        meta: {
            title: '错题练习',
        }
    },
    {
        path: '/ques-collect',
        name: 'QuesCollect',
        component: () =>
            import('../views/question/QuesCollect.vue'),
        meta: {
            title: '习题收藏',
        }
    },
    {
        path: '/point',
        name: 'Point',
        component: () =>
            import('../views/question/Point.vue'),
        meta: {
            title: '考点专练',
        }
    },//题库结束

    {
        path:"/setinfo",
        name:"SetInfo",
        component:()=>import("../views/person/info/SetInfo.vue")
    }
]

export default routes
