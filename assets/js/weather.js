// let day = +new Date('2023-02-24T18:28:05+03:00') / 1000;
// console.log(day);
// let c =  new Date(1677146400 * 1000);
// console.log(c.toLocaleDateString("en-GB"));
// console.log(c.toLocaleTimeString("it-IT"));
//https://api.openweathermap.org/data/2.5/onecall?lat=50.4333&lon=30.5167&&exclude=dailyl&.dt=1642550400&appid=bf35cac91880cb98375230fb443a116f
let q = "Біла Церква";
//let url1 = `http://api.openweathermap.org/data/2.5/forecast?q=${q}&appid=bf35cac91880cb98375230fb443a116f`;
let list_class = [];
let arrDays = [];
//localStorage.setItem("t", "c");


SearchWeather(q);
//SearchWeather('assets/json/response.json');

function  SearchWeather(q) {
    let url1;
    if (q != 'assets/json/response.json') {
         url1 = `http://api.openweathermap.org/data/2.5/forecast?q=${q}&appid=bf35cac91880cb98375230fb443a116f`;
    } else { url1 = 'assets/json/response.json'; q = 'Біла Церква';}
    let promise = fetch(url1);
    let header = document.querySelector("header");
    // Удаляем все дочерние элементы div
    while (header.firstChild) {
        if (header.firstChild.tagName === 'DIV') {
            header.removeChild(header.firstChild);
        } else {
            header.removeChild(header.firstChild);
        }
    }
    arrDays.length = 0;
    list_class.length = 0;

    promise
        .then(response => response.json())
        .then(function (response) {
// //Сохраняем файл JSON т.к. GITHUB блокирует запрос API
//  Конвертируем объект в строку JSON
//             const jsonString = JSON.stringify(response);
//
// // Создаем новый объект типа Blob из строки JSON
//             const blob = new Blob([jsonString], { type: "application/json" });
//
// // Сохраняем файл с помощью FileSaver.js
//             saveAs(blob, "E:\\IT\\Проекты\\Weather\\response.json");
            //console.log(response.list);




            let first_day = new Date(response.list[0].dt_txt);
            first_day = first_day.getDate();

//ЦИКЛ----------------

            let id_day = 0;
            response.list.forEach(dt => {
                let dt_data = new Date(dt.dt_txt);


                if (first_day == dt_data.getDate()) {
                    list_class.push(dt);
                    // console.log(dt)
                } else {
                    //если новый день - создаем класс
                    if (list_class.length > 0) {
                        let day = new Day(list_class);
                        day.city = q;
                        if (id_day == 0) {
                            day.selected_day = true
                        }
                        ;
                        arrDays.push(day);
                        id_day++;
                        header.insertAdjacentElement("beforeend", day.get_div(id_day));
                    }
                    //------------
                    list_class.splice(0);
                    first_day = dt_data.getDate()
                }
            }) // end foreach


            if (list_class.length > 0) {
                let day = new Day(list_class);
                day.city = q;
                arrDays.push(day);
                id_day++;
                header.insertAdjacentElement("beforeend", day.get_div(id_day));
            }

            //--------Главная картинка выбранного дня--------
            let main_img = document.querySelector(".big_img_main_day");
            main_img.innerHTML = `<p class="p_city_day">${arrDays[0].city}</p>`;
            main_img.innerHTML += `<p class="p_week_sel_day">${arrDays[0].day_weeks}</p>`;
            main_img.innerHTML += arrDays[0].get_img_time(12, 'big');


            //-----Главная таблица -------------------
            let main_table = document.querySelector(".main_table");
            // Удаляем все дочерние элементы div
            while (main_table.firstChild) {
                if (main_table.firstChild.tagName === 'DIV') {
                    main_table.removeChild(main_table.firstChild);
                } else {
                    main_table.removeChild(main_table.firstChild);
                }
            }

            main_table.insertAdjacentElement("beforeend", arrDays[0].get_table());


        }) // end response

        .catch(error => {
          console.log(error.message);
          let p = document.querySelector(".about");
          p = "Данні були заванитеженні з JSON архиву на 27 Лютого, тому що GitHub блокує завантаження з API http://api.openweathermap.org";
          SearchWeather('assets/json/response.json');
        }); // обработка исключений, например, проблем с сетью
}
//--------------table --------------


let arrMonth = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вереснь', 'Жовтень', 'Листопад', 'Грудень'];

class Day {
    list_dt = [];
    selected_day;
    city;
    constructor(list) {
        for (let i = 0; i < list.length; i++) {
            this.list_dt.push(list[i]);
        }
        this.i = Math.round(this.list_dt.length / 2) - 1;
        //console.log(this.list_dt)
        // console.log(this.list_dt[0,1]);
        this.dt = this.list_dt[this.i].dt;
        this.data = new Date(this.dt * 1000);

        this.day_weeks = Day_of_week(this.data);
        this.num_day = this.data.getDate();
        this.num_day_weeks = this.data.getDay(this.data);
        this.month_name = arrMonth[this.data.getMonth()];
    }

    get_div(id) {
        this.id = id;
        this.div_day = document.createElement("div");
        this.div_day.classList.add("div_day");
        this.div_day.setAttribute("id", this.id);
        this.p_day_weeks = document.createElement("p");
        this.p_day_weeks.classList.add("day_weeks");
        this.p_day_weeks.innerHTML = this.day_weeks;

        this.p_num_day = document.createElement("p");
        this.p_num_day.classList.add("num_day");
        // ----------выходные красным--------
        if (this.num_day_weeks == 0 || this.num_day_weeks == 6) {
            this.p_num_day.classList.add("weekday");
            this.p_day_weeks.classList.add("weekday");
        }
        this.p_num_day.innerHTML = this.num_day;


        this.p_month_name = document.createElement("p");
        this.p_month_name.classList.add("month_name_p");
        this.p_month_name.innerHTML = this.month_name;

        this.img_days = document.createElement("p");
        this.img_days.innerHTML =  this.get_img_time(12, 'small');
        // this.img_days = document.createElement("img");
        // this.img_days.classList.add("img_days");
        // this.img_days.setAttribute('src', `assets/img/${this.list_dt[this.i].weather[0].icon}.png`);//`http://openweathermap.org/img/wn/${this.list_dt[this.i].weather[0].icon}@2x.png`);
        // this.img_days.setAttribute('alt', this.list_dt[this.i].weather[0].icon);

        this.div = document.createElement("div");
        this.t_min = document.createElement("p");
        if (localStorage.getItem("t") == "c") {
            let t = Math.round(+this.list_dt[this.i].main.temp_min - 273);
            if (t>0) { this.t_min.innerHTML = `  +${t}С&#176`};
            // this.t_max.innerHTML = ` max= ${Math.round(+this.list_dt[this.i].main.temp_max - 273)}`;
        } else {
            this.t_min.innerHTML = ` ${Math.round(+this.list_dt[this.i].main.temp_min)} F&#176`;
        }
        //---------Moroz--------
        if (this.list_dt[this.i].main.temp_min - 273 <= 0) {
            this.t_min.classList.add("moroz");
        } else {
            this.t_min.classList.add("plus");
        }

        //-----------------------
        this.t_min.classList.add("t_min_max");
        this.div.append(this.t_min);
        // -----selected_day ---------------
        //  console.log(this.selected_day)
        if (this.selected_day == true) {
            this.div_day.classList.add("selected_day");
        }

        this.div_day.append(this.p_day_weeks);
        this.div_day.append(this.p_num_day);
        this.div_day.append(this.p_month_name);
       // this.div_day.innerHTML = this.get_img_time(12);
        this.div_day.append(this.img_days);
        this.div_day.append(this.div);

        /// ------------ON CLICK  SEL DAY ------------
        this.div_day.addEventListener("click", function (e) {
            let main_img = document.querySelector(".big_img_main_day");
            arrDays.forEach(d => {
                let div_day = document.querySelector(`[id="${d.id}"]`);
                if (d.id == this.id) {
                    div_day.classList.add("selected_day");
                } else {
                    div_day.classList.remove("selected_day");
                }
            })


            //------Надпись над картинкой главного дня ------------
            let p = document.createElement("p");
            console.log(arrDays[this.id - 1])
            main_img.innerHTML = `<p class="p_city_day">${arrDays[this.id - 1].city}</p>`;
            main_img.innerHTML += `<p class="p_week_sel_day">${arrDays[this.id - 1].day_weeks}</p>`;
            // main_day.insertAdjacentElement("beforeend",p);
            //--------Главная картинка выбранного дня--------

            main_img.innerHTML += arrDays[this.id - 1].get_img_time(12,'big');
            //---------main table ------------------
            let main_table = document.querySelector(".main_table");
            let tbl = document.querySelector("table");
            tbl.remove();
            main_table.insertAdjacentElement("beforeend", arrDays[this.id - 1].get_table());

        })

        return this.div_day;
    }

    get_img_time(time,big) {

        let img_day = '';
        this.list_dt.forEach(d => {
            let dt_txt = new Date(d.dt_txt);
            if (dt_txt.getHours() == time) {
                img_day = `<img src="http://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png"  class = "small_img" alt =${d.weather[0].icon} >`;
                img_day = `<img src=assets/img/${d.weather[0].icon}.png  class = 'small_img' alt =${d.weather[0].icon} >`;
                if (big == 'big') {
                    img_day = `<img src=assets/img/${d.weather[0].icon}.png  class = 'big_img' alt =${d.weather[0].icon} >`;
                }
                if (big == 'small') {
                    img_day = `<img src=assets/img/${d.weather[0].icon}.png  class = 'img_days' alt =${d.weather[0].icon} >`;
                }
            }
        }) // forech end
        if (img_day == '' && big == 'big') { // если time = null то выдать первую из массива картинку
            img_day = `<img src=assets/img/${this.list_dt[0].weather[0].icon}.png  class = 'big_img' alt =${this.list_dt[0].weather[0].icon} >`;
        }
        if (img_day == '' && big == 'small') { // если time = null то выдать первую из массива картинку
            img_day = `<img src=assets/img/${this.list_dt[0].weather[0].icon}.png  class = 'img_days' alt =${this.list_dt[0].weather[0].icon} >`;
        }
            return img_day;
    }

//------получаем все данные по времени 3ч 6ч 9ч...  главного дня--------------
    get_day_t(time) {
        let t = -1000;
        let feels_like = -1000;
        let pressure = -1000;
        let humidity = -1000;
        let wind = -1000;
        let c_f = localStorage.getItem("t");
        let znak ='';
        let Celciy = '';
        if (c_f == "c") { znak = "+"; Celciy = 'С&#176'};
        this.list_dt.forEach(d => {
            let dt_txt = new Date(d.dt_txt);
            if (dt_txt.getHours() == time) {
                if (localStorage.getItem("t") == "c") {
                    t = Math.round(+d.main.temp - 273);
                    feels_like = Math.round(+d.main.feels_like - 273);
                } else {
                    t = d.main.temp;
                    feels_like = d.main.feels_like;
                }
                pressure = d.main.pressure;  // атм давление
                humidity = d.main.humidity+'%'; //вологість
                wind = `${Math.round(+d.wind.speed)} м/c`; // вітер
            }
        }) // forech end
        if (t == -1000) {
            t = '';
        } else {
            if(t>0) { t = `<p class="plus">${znak}${t+Celciy}</p>`;}
            else { t = `<p class="moroz">${t}${Celciy}</p>`;}
        }
        if (feels_like == -1000) {
            feels_like = '';
        } else {
           // feels_like = `${feels_like}С&#176`;
            if(feels_like>0) { feels_like = `<p class="plus">${znak}${feels_like}${Celciy}</p>`;}
            else { feels_like = `<p class="moroz">${feels_like}${Celciy}</p>`;}
        }
        if (pressure == -1000) {
            pressure = ''
        }
        if (humidity == -1000) {
            humidity = ''
        }
        if (wind == -1000) {
            wind = ''
        }

        return [t, feels_like, pressure, humidity, wind];
    }

    get_table() {
        this.table = document.createElement("table");

        this.th = document.createElement("th");
        this.td = document.createElement("td");
        this.tr = document.createElement("tr");

        this.tr.innerHTML = `<th></th><th colspan="2">Ніч</th><th colspan="2">Ранок</th><th colspan="2">День</th><th colspan="2">Вечір</th> `;
        this.table.append(this.tr);
//-------------------------------------------


        //------------Time----------------------------
        this.tr = document.createElement("tr");
        this.td.innerHTML = "";
        this.tr.innerHTML = `<td class="gray_td"></td> <td class="gray_td">3:00</td> <td  class="gray_td">6:00</td><td class="gray_td">9:00</td><td class="gray_td">12:00</td><td class="gray_td">15:00</td><td class="gray_td">18:00</td><td class="gray_td">21:00</td><td class="gray_td">23:00</td>`;
        this.table.append(this.tr);
        //-------IMG TABLE -------------
        this.tr = document.createElement("tr");
        this.tr.innerHTML = `<td></td> <td>${this.get_img_time(3)}</td> <td>${this.get_img_time(6)}</td><td>${this.get_img_time(9)}</td><td>${this.get_img_time(12)}</td><td>${this.get_img_time(15)}</td><td>${this.get_img_time(18)}</td><td>${this.get_img_time(21)}</td><td>${this.get_img_time(21)}</td>`;
        this.table.append(this.tr);
        //------------ICON-----------------
        this.tr = document.createElement("tr");
        //this.tr.innerHTML = `<td></td> <td>${this.list_dt[0].}</td> <td>5:00</td><td>8:00</td><td>11:00</td><td>14:00</td><td>17:00</td><td>20:00</td><td>23:00</td>`;
        this.table.append(this.tr);

        //----------------------------------------

        this.tr = document.createElement("tr");
        this.tr.innerHTML = `<td class="name_value_table">Температура t</td><td>${this.get_day_t(3)[0]}</td><td>${this.get_day_t(6)[0]}</td><td>${this.get_day_t(9)[0]}</td><td>${this.get_day_t(12)[0]}</td><td>${this.get_day_t(15)[0]}</td><td>${this.get_day_t(18)[0]}</td><td>${this.get_day_t(21)[0]}</td><td>${this.get_day_t(21)[0]}</td>`;
        this.table.append(this.tr);
        this.tr = document.createElement("tr"); //feels_like
        this.tr.innerHTML = `<td class="name_value_table">Почувається як</td><td>${this.get_day_t(3)[1]}</td><td>${this.get_day_t(6)[1]}</td><td>${this.get_day_t(9)[1]}</td><td>${this.get_day_t(12)[1]}</td><td>${this.get_day_t(15)[1]}</td><td>${this.get_day_t(18)[1]}</td><td>${this.get_day_t(21)[1]}</td><td>${this.get_day_t(21)[1]}</td>`;
        this.table.append(this.tr);
        this.tr = document.createElement("tr");//pressure
        this.tr.innerHTML = `<td class="name_value_table">Атмосферний тиск</td><td>${this.get_day_t(3)[2]}</td><td>${this.get_day_t(6)[2]}</td><td>${this.get_day_t(9)[2]}</td><td>${this.get_day_t(12)[2]}</td><td>${this.get_day_t(15)[2]}</td><td>${this.get_day_t(18)[2]}</td><td>${this.get_day_t(21)[2]}</td><td>${this.get_day_t(21)[2]}</td>`;
        this.table.append(this.tr);    //humidity
        this.tr.innerHTML = `<td class="name_value_table">Вологість</td><td>${this.get_day_t(3)[3]}</td><td>${this.get_day_t(6)[3]}</td><td>${this.get_day_t(9)[3]}</td><td>${this.get_day_t(12)[3]}</td><td>${this.get_day_t(15)[3]}</td><td>${this.get_day_t(18)[3]}</td><td>${this.get_day_t(21)[3]}</td><td>${this.get_day_t(21)[3]}</td>`;
        this.table.append(this.tr);
        this.tr = document.createElement("tr"); //wind
        this.tr.innerHTML = `<td class="name_value_table">Вітер</td><td>${this.get_day_t(3)[4]}</td><td>${this.get_day_t(6)[4]}</td><td>${this.get_day_t(9)[4]}</td><td>${this.get_day_t(12)[4]}</td><td>${this.get_day_t(15)[4]}</td><td>${this.get_day_t(18)[4]}</td><td>${this.get_day_t(21)[4]}</td><td>${this.get_day_t(21)[4]}</td>`;
        this.table.append(this.tr);


        this.table.append(this.tr);
        return this.table;
    }

}
function Day_of_week(d) {
    var days = [
        'Неділя',
        'Понеділок',
        'Вівторок',
        'Середа',
        'Четвер',
        "П'ятниця",
        'Субота'
    ];
    let n = d.getDay();
    return (days[n]);
}

let btn_search = document.querySelector(".btn_search");
let input_search = document.querySelector(".search_text");
btn_search.addEventListener("click", function (){

    q = input_search.value;
    SearchWeather(q);
})
//--------нажате Enter -----------------
input_search.addEventListener('keydown', function(event) {
    // Проверяем, была ли нажата клавиша Enter
    if (event.keyCode === 13) {
        // Если да, то вызываем клик на кнопке
        btn_search.click();
    }
});
 //---------- F / C -----------------------
let img_temp_c = document.querySelector(".img_temp_c");
let img_temp_f = document.querySelector(".img_temp_f");
// если хранилище пустое  то записываем Цельсий
if (!localStorage.getItem("t")) {localStorage.setItem("t","c")};

if (localStorage.getItem("t")=="c") { img_temp_c.classList.add("img_temp_selected");};
if (localStorage.getItem("t")=="f") { img_temp_f.classList.add("img_temp_selected");};
img_temp_f.addEventListener("click", function (){
    localStorage.setItem("t", "f");
    location.reload(); //перезагрузить страницу
    img_temp_f.classList.add("img_temp_selected");
})
img_temp_c.addEventListener("click", function (){
    localStorage.setItem("t", "c");
    location.reload();//перезагрузить страницу
    img_temp_c.classList.add("img_temp_selected");
})