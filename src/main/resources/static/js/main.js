function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }

    return -1;
}


var userApi = Vue.resource('/user{/id}');

Vue.component('user-form', {
    props: ['users', 'userAttr'],
    data: function() {
        return {
            id: '',
            name: '',
            surname: '',
            patronymic: '',
            phone: '',
            email: ''
        }
    },
    watch: {
        userAttr: function(newVal, oldVal) {
            this.id = newVal.id;
            this.name = newVal.name;
            this.surname = newVal.surname;
            this.patronymic = newVal.patronymic;
            this.phone = newVal.phone;
            this.email = newVal.email;
        }
    },
    template:
    '<div>' +
    '<label>Добавить нового пользователя :</label><br />' +
    '<input type="name" placeholder="Имя" v-model="name" /> ' +
    '<input type="surname" placeholder="Фамилия" v-model="surname" /> ' +
    '<input type="patronymic" placeholder="Отчество" v-model="patronymic" />' +
    '<br />' +
    '<input type="phone" placeholder="Телефон" v-model="phone" /> ' +
    '<input type="email" placeholder="Почта" v-model="email" />' +
    '<br />' +
    '<input type="button" value="Save" @click="save" />' +
    '</div>',
    methods: {
        save: function() {
            var user = {  name: this.name, surname:this.surname, patronymic:this.patronymic, phone: this.phone,
                email: this.email};

            if (this.id) {
                userApi.update({id: this.id}, user).then(result =>
                result.json().then(data => {
                    var index = getIndex(this.users, data.id);
                this.users.splice(index, 1, data);
                this.id = ''
                this.name = ''
                this.surname = ''
                this.patronymic = ''
                this.phone = ''
                this.email = ''
            })
            )
            } else {
                userApi.save({}, user).then(result =>
                result.json().then(data => {
                    this.users.push(data);
                this.name = ''
                this.surname = ''
                this.patronymic = ''
                this.phone = ''
                this.email = ''
            })
            )
            }
        }
    }
});

Vue.component('user-row', {
    props: ['user', 'editMethod', 'users'],
    template: '<div>' +
    '<i>({{ user.id }})</i> {{ user.name }} | {{ user.surname }} | {{ user.patronymic }} | {{ user.phone }} |' +
    ' {{ user.email }} ' +
    '<input class="small" type="button" value="Edit" @click="edit" />' +
    '<input class="small" type="button" value="X" @click="del" />' +
    '</span>' +
    '</div>',
    methods: {
        edit: function() {
            this.editMethod(this.user);
        },
        del: function() {
            userApi.remove({id: this.user.id}).then(result => {
                if (result.ok) {
                this.users.splice(this.users.indexOf(this.user), 1)
            }
        })
        }
    }
});

Vue.component('users-list', {
    props: ['users'],
    data: function() {
        return {
            user: null,
            filter: '',
            filterUsers: null
        }
    },
    template:
    '<div class="form-group col-md-6">' +
    '<user-form :users="users" :userAttr="user" /> <br />' +
    '<label for="filt">Поиск по имени :  </label>' +
    '<input type="filter" placeholder="Введите имя" v-model="filter" @input="search" id="filt" />' +
    '<div v-if="!filter">' +
        '<user-row v-for="user in users" :key="user.id" :user="user" :editMethod="editMethod" :users="users" />' +
    '</div>' +
    '<div v-else>' +
        '<user-row :user="filterUsers" :editMethod="editMethod" :users="filterUsers" />' +
    '</div>' +
    '</div>',
    created: function() {
        userApi.get().then(result =>
           result.json().then(data =>
            data.forEach(user => this.users.push(user))
           )
        )
    },
    methods: {
        search: function () {
            this.filterUsers = null
            for(var i=0; i<this.users.length; i++) {
                var usr = this.users[i]
                if(usr.name===this.filter)
                    this.filterUsers = usr
            }
            console.log(this.filterUsers)
        },
        editMethod: function(user) {
            this.user = user;
        }
    }
});

var app = new Vue({
    el: '#app',
    template: '<users-list :users="users" />',
    data: {
        users: []
    }
});