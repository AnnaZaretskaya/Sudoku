$(function(){
//console.log('я подключен!');

//baseMatrix - базовая матрица, из которой делаються все возможные комбинации игр
//baseGame  - это ответ, полностью заполненная матрица, которую юзер должен получить
var baseMatrix = makeBaseMatrix();
var baseGame;
/*game - это неполностью заполненная матрица, то что юзер видит в самом начале
юзер не может ее изменить, "Подсказка" добавляет в эту матрицу значение из baseGame
чтоб запретить возможность кликнуть на нее и менять проверенное значение,
"Показать ответ" полностью заполняет game, и запрещает что-то менять
*/
var game = [];
game = NewGame();
//это индексы той ячейки, куда нажмет юзер. Работает, только для тех ячеек, которые разрешено менять.
var curRow;
var curCol;
//здесь  создаётся матрица userChoice, предполагаемый юзером ответ.
//цифры, которые  показаны юзеру изначально из матрицы game тоже входят userChoice
var userChoice = [];
for(var i=0; i<9; i++){
	userChoice[i] = [];
		for(var j=0; j<9; j++){
			userChoice[i][j] = game[i][j];
		}
}


//возвращает аргумент, но взятый по модулю 9
function poModuly9(k) {
	while (k>=10) {
		k = k-9;
	};
	return k;
}
//делает базовую матрицу
function makeBaseMatrix(){
  var baseMatrix = [];
  for(var i=0; i<9; i++){
    baseMatrix[i] = [];
    for(var j=0; j<9; j++){
		baseMatrix[i][j] = poModuly9(3*i+j+(Math.floor(i/3))+1);
	}
  }
   return baseMatrix;
}
//генерирует массив случайных чисел, каждое из которых 0, 1 или 2.
function helloGod(k){// k - это магическое число
	var numOfGod = [];
	for (var i = 0; i < k; i++) {
		var temp = Math.random();
		if (temp < 0.33333333333333333) {
			numOfGod[i] = 0;
		} 
		if ((temp >= 0.33333333333333334)&&(temp < 0.6666666666666666)) {
			numOfGod[i] = 1;
		}
		if (temp >= 0.6666666666666667) {
			numOfGod[i] = 2;
		}
	}
	//console.log('я знаю numOfGod', numOfGod, 'длина numOfGod', numOfGod.length);
	return numOfGod;
}
//должна генерировать полную матрицу ответа, рандом дает 17 цифр после запятой
function NewGame(){
	//console.log('я вошло в NewGame()');
	//массив случайных чисел, каждое число в [0, 2]
	var k = 42;// 42 - ответ на главный вопрос жизни, вселенной и всего остального, его можно менять
	numOfGod = helloGod(k);
	baseGame = baseMatrix;
	for (var i = 0; i < k-10; i = i+10) {
		baseGame = transpon(baseMatrix);
		baseGame = rowsInBlock(baseGame, numOfGod[i+1],numOfGod[i+2],numOfGod[i+3]);
		baseGame = colsInBlock(baseGame, numOfGod[i+4],numOfGod[i+5],numOfGod[i+6]);
		baseGame = bigRows(baseGame, numOfGod[i+7],numOfGod[i+8]);
		baseGame = bigCols(baseGame, numOfGod[i+9],numOfGod[i+10]);
	}
	//нужно обнулить
	game = dropSomeCells();
	Show(game);
	return game;
}
//транспонирует матрицу, возвращает ее же.
function transpon(matrix) {
	//console.log('я вошло в transpon');
	if (Math.random() <= 0.5) {
		for (var i=0; i<9; i++) {
			for(var j=i; j<9; j++){
				var temp;
				temp = matrix[i][j];
				matrix[i][j] = matrix[j][i];
				matrix[j][i] = temp;
			}
		}
		//console.log('я сделало transpon');
	}
return matrix;
}
//меняет местами строку a и стороку b в блоке c. 
function rowsInBlock(matrix, a,b,c) {
	//console.log('я вошло в rowsInBlock с а = ', a, ', b = ', b, ', c = ', c);
	//чтоб строки не совпали между собой случайно
	if (a == b) {b = (b == 2)? 0 : (b+1)};
	//значит индекс первого и второго столбца в матрице считается так:
	a = a+3*c;
	b = b+3*c;
	//console.log('я  в colsInBlock, a = ', a, 'и b = ', b);
	for (let i=0; i<9; i++) {
		let temp;
		temp = matrix[a][i];
		matrix[a][i] = matrix[b][i];
		matrix[b][i] = temp;
	}	
	//console.log('я поменяло', a, 'и', b, 'строчки');
return matrix;
}
//меняет местами столбец a и столбец b в блоке c.
function colsInBlock(matrix, a,b,c) {
	//console.log('я вошло в colsInBlock с а = ', a, ', b = ', b, ', c = ', c);
	//чтоб столбцы не совпали между собой случайно
	if (a == b) {b = (b == 2)? 0 : (b+1)};
	//значит индекс первого и второго столбца в матрице считается так:
	a = a+3*c;
	b = b+3*c;
	//console.log('я  в colsInBlock, a = ', a, 'и b = ', b);
	for (let i=0; i<9; i++) {
		let temp;
		temp = matrix[i][a];
		matrix[i][a] = matrix[i][b];
		matrix[i][b] = temp;
	}	
	//console.log('я поменяло', a, 'и', b, 'столбцы');
return matrix;
}
//меняет местами строки блоков, т.е. "толстые" строки, т.е. три строки с тремя строками
function bigRows(matrix, a,b) {
	//console.log('я вошло в bigRows с a = ', a, 'и b = ', b);
	//чтоб строки не совпали между собой случайно
	if (a == b) {b = (b == 2)? 0 : (b+1)};
	//console.log('я  в bigRows, a = ', a, 'и b = ', b);
	for (let i=0; i<9; i++) {
		for (let j=0; j<3; j++){
			let temp;
			temp = matrix[3*a+j][i];
			matrix[3*a+j][i] = matrix[3*b+j][i];
			matrix[3*b+j][i] = temp;
		}
	}	
	//console.log('я поменяло', a, 'и', b, ' толстые строки');
return matrix;
}
//меняет местами столбцы блоков, т.е. "толстые" столбцы, т.е. три столбца с тремя столбцами
function bigCols(matrix, a,b) {
	//console.log('я вошло в bigCols с a = ', a, 'и b = ', b);
	//чтоб строки не совпали между собой случайно
	if (a == b) {b = (b == 2)? 0 : (b+1)};
	//console.log('я  в bigCols, a = ', a, 'и b = ', b);
	for (let i=0; i<9; i++) {
		for (let j=0; j<3; j++){
			let temp;
			temp = matrix[i][3*a+j];
			matrix[i][3*a+j] = matrix[i][3*b+j];
			matrix[i][3*b+j] = temp;
		}
	}	
	//console.log('я поменяло', a, 'и', b, ' толстые столбцы');
return matrix;
}
//должна рисовать матрицу, заполненную матрицей аргумента
function Show(matrix) {
var table = document.getElementById("table");// здесь jquery не сработало
  for(var i=0; i<9; i++){
    for(var j=0; j<9; j++){
		if (matrix[i][j]){ 
			table.rows[i].cells[j].innerHTML = matrix[i][j]
		} else {
			table.rows[i].cells[j].innerHTML = ' ';
			}
		if (game[i][j]) {
			table.rows[i].cells[j].style.background = 'rgba(235, 235, 235, 1)';
		} else {
			table.rows[i].cells[j].style.background = 'white';
			}
		
		 
    }
  }
}
// эта функция должна выкинуть из матрицы baseGame некоторые цифры наугад, 
//возвращает  и показывает другую матрицу
function dropSomeCells() {
//console.log('я вошло в dropSomeCells ');
  for(var i=0; i<9; i++){
    game[i] = [];
    for(var j=0; j<9; j++){		
		if (Math.random()<0.45) {
			//console.log('я вошло в if (Math.random()<0.45)', (Math.random()<0.45));
			game[i][j] = baseGame[i][j];
		} else {game[i][j] = null}
		
	}
  }
return game;
}
//показывает ответ, запрещает изменнения после этого
$("#showAnswer").click (function() {
Show(baseGame) ;
for(var i=0; i<9; i++){
    for(var j=0; j<9; j++){
		game[i][j] = baseGame[i][j];
		table.rows[i].cells[j].style.background = 'rgba(235, 235, 235, 1)';
	}
}
});
//показывает первую ошибку юзера
$("#showTip").click (function() {
$(".popup").fadeOut(50);
for(var i=0; i<9; i++){
    for(var j=0; j<9; j++){
		
		if ((!(userChoice[i][j] == null))&&(game[i][j] == null)&&(userChoice[i][j] != baseGame[i][j])) {
			table.rows[i].cells[j].style.background = 'pink';
			setTimeout(function() { 
				table.rows[i].cells[j].innerHTML = baseGame[i][j]}, 1000);
			setTimeout(function() {
				table.rows[i].cells[j].style.background = 'rgba(235, 235, 235, 1)'}, 2000);
			game[i][j] = baseGame[i][j];
			userChoice[i][j] = baseGame[i][j];
			isWin();
			return false;
		} 
		
		 
    }
}
});
//собственно, обработчик  клика на табличку
$(".table").click (function(event) {
    //console.log('я вошло в table.onclick ');
    event = event || window.event;// для IE
	var cell = event.target || event.srcElement;// для IE
	if (cell.tagName.toLowerCase() != 'td')
		return;
	curRow = cell.parentNode.rowIndex;
	curCol = cell.cellIndex;
	if (game[curRow][curCol]) {
		//console.log('кликнули на мою серую ячейку по адресу ', curRow, curCol);
	} else {
		//console.log('кликнули на мою белую ячейку по адресу ', curRow, curCol);
		//здесь надо показать юзеру циферки, чтоб дать нажать на них
		$(".popup").fadeIn(100);
		$('.popup').css({'top': event.pageY, 'left': event.pageX});
		}
});	
//обработчик нажатия на всплывающее меню
$(".popup").click(function(event){
    //console.log('я вошло в popup.onclick ');
    event = event || window.event;// для IE
	// butt тот самый button, на который нажали, butt - :)
    var butt = event.target || event.srcElement;// для IE
	if (butt.tagName.toLowerCase() == 'a') {
		$(".popup").fadeOut(50);
	}
	if (butt.tagName.toLowerCase() == 'button') {
				//тут нужно записать в userChoice нажатое число, обновить его на экране
				setToUserChoice(curRow,curCol,butt.value);
				$(".popup").fadeOut(50);
				isWin();
	}		
		
});
//эта функция получает индексы выбранной юзером ячейки и значение нажатой им кнопки
//должна засисать в  userChoice нажатое число и вызвать чтоб отобразить обновленное состояние
function setToUserChoice(curRow,curCol,value){
	if (Number(value)){
		//console.log('я  зашло в if, value = ', value, 'Number(value) = ', Number(value));
		userChoice[curRow][curCol] = Number(value);
		table.rows[curRow].cells[curCol].innerHTML = Number(value);
	} else {
		//console.log('я  зашло в else value = ', value, 'Number(value) = ', Number(value));
		userChoice[curRow][curCol] = null;
		table.rows[curRow].cells[curCol].innerHTML = ' ';
	}
//console.log('записано в userChoice', userChoice[curRow][curCol]);
}
//просто обновляет страничку
$("#refresh").click(function(event){
	location.reload();
});
//проверяет окончена ли игра?
function isWin(){
for(var i=0; i<9; i++){
    for(var j=0; j<9; j++){
		if (!(baseGame[i][j] == userChoice[i][j])) {
			return false;
		}
	}
}
alert('молодец, держи плюшку!');
}
});	