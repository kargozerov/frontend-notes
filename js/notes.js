"use strict";
window.addEventListener("load", () => {
    const  app = new Vue({
        el:"#app",
        data:{
            newNoteText:"", //текст сообщения
            notes:[],  //список заметок
            showNewNoteForm: false, //показывать форму при нажатии на добавить форму
            formHasError: false, //в форме есть ошибка (для изменения класса)
            formIsValid: false, //форма для показывания зеленой галочки
            showArchived: false,
            infoMessage: "", //собщениие об ошибках
        },
        methods: {
            saveNote(){
                if (this.newNoteText !==""){
                    this.notes.unshift({ //пушим заметки в массив
                        text: this.newNoteText,
                        createdAt: new Date(),
                        deleted: false, //флаг удалена заметка или нет
                        archived: false, //флаг заархивирована заметка или нет
                    });
                   // notes[{text:dkjfkdf,createdAt: dklkdlfkdlf},{text:dkjfkdf,createdAt: dklkdlfkdlf}]
                    this.newNoteText = ""; //убираем старый текст
                    this.formHasError = false;
                    this.formIsValid = false;
                    this.showNewNoteForm = false;
                    this.sendNotes(); //вызываем метод post при добавлении заметки (что бы передать данные на сервак)
                }else {
                    this.formHasError = true;
                }
            },
            deleteNote(note){ //удаляем заметку
                note.deleted = true;
                this.sendNotes();
            },
            restoreNote(note){ //востановить заметку
                note.deleted = false;
                this.sendNotes();
            },
            moveToArchive(note){ //добавить в архив
                note.archived = true;
                this.sendNotes();
            },
            returnFormArchive(note){ //из архива (желтая кнопка)
                note.archived = false;
                this.sendNotes();
            },
            sendNotes(){ //отправка запроса post
                //filter( n => !n.deleted) - фильтруем не удаленные n -первая заметка (true - для тех которые не удалены)
                axios.post("http://localhost:9000", this.notes.filter( n => !n.deleted))  //полная перезапись каждый раз новый массив
                    .then((response) =>{
                        this.infoMessage = response.data.message; // из сервера res.json({status: "ok", message: "Заметки успешно сохранены"});
                        setTimeout( () => {this.infoMessage = "";}, 1800); //показать сообщегие и через 1,8 сек скрыть
                    })
                    .catch(console.log); //в случаее ошибки ошибка будет обработана через console.log
            },
        },
        watch: {
            //эта функция вызывается при любом изменении newNoteText
            newNoteText(newValue){
                this.formIsValid = newValue !== "" && this.showNewNoteForm;
                this.formHasError = newValue === "" && this.showNewNoteForm; //реагируем на ввод текста зеленая рамка и галочка при вводе текста
            },
        },
        filters:{
            formatDate (value){
                const now = new Date(value); //для перевода даты в читабельный формат (2019-09-14T13:04:33.649Z - в таком виде приходит из JSON)
                const padZero = function (n) {
                    return n < 10 ? "0" + n : n;
                };
                const Y = now.getFullYear();
                const m = padZero(now.getMonth()+1);
                const d = padZero(now.getDate());

                const h = padZero(now.getHours());
                const min = padZero(now.getMinutes());

                return `${d}.${m}.${Y} в ${h}:${min}`;
            }
        },
        computed: {
            filteredNotes(){ //отфильтрованные заметки
                if (this.showArchived){ //сюда приходит showArchived = true после нажатия на чекбокс
                    return this.notes;
                }
                return this.notes.filter(note => !note.archived); //оставит те заметки не в архиве у которы флаг archived = false
                //после фильтрации элементы которые не архиве получаем
            }
        },
        //функиця mounted - это хук жизненого цикла т.е специальная функция котора выполняется в конкретный момент времени
        //mounted выполняется после того как приложение было впервый раз полностью отрисовано
        mounted(){
            //отправляем GET запрос по указаному адресу
            axios.get('http://localhost:9000') //получить данные (фронт говорит дай мне данные)
                    .then(response => {  //response - информация от сервера response.data
                        //сохраняем в приложение данные полученые на сервере
                    this.notes = response.data;
                })
                .catch(console.log); //выведет ошибку в консоль
        }
    });
});