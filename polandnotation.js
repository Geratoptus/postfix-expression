const fs = require("fs");

function IsDigit(symbol){
	return symbol == "1" || symbol == "2" || symbol == "3" || symbol == "4" || symbol == "5" || symbol == "6" || symbol == "7" || symbol == "8" || symbol == "9" || symbol == "0";
}

function IsOperation(symbol){
	return symbol == "+"|| symbol == "-"|| symbol == "*"|| symbol == "/"|| symbol == "^"|| symbol == "~";
}

function GetNumberFromString(expression, position){
	let number = "";
	for (position; position < expression.length; position++){
		let symbol = expression[position];
		
		if (IsDigit(symbol))
			number += symbol;
		else{
			position--;
			break;
		}
	}
	return {number, position}
}

let all_operations = new Array();

all_operations['('] = 0;
all_operations['+'] = 1;
all_operations['-'] = 1;
all_operations['*'] = 2;
all_operations['/'] = 2;
all_operations['^'] = 3;
all_operations['~'] = 4; //unary minus

function ToPostfix(infix_expression){
	let postfix_expression = "";
	let stack = new Array();
	
	for (let i = 0; i < infix_expression.length; i++){
		let current_symbol = infix_expression[i];
		
		if (IsDigit(current_symbol)){
			let temp_obj = GetNumberFromString(infix_expression, i);
			postfix_expression += temp_obj.number + " ";
			i = temp_obj.position;
		}
		else if (current_symbol == "(")
		{
			stack.push(current_symbol);
		}
		else if (current_symbol == ")")
		{
			while (stack.length > 0 && stack[stack.length - 1] != "(")
				postfix_expression += stack.pop();
			stack.pop();
		}
		else if (IsOperation(current_symbol))
		{
			let operation = current_symbol;
			
			if (operation == "-" && (i == 0 || (i > 1 && IsOperation(infix_expression[i - 1]))))
				operation = "~";
			if (operation != "^")
				while (stack.length > 0 && all_operations[stack[stack.length - 1]] >= all_operations[operation])
					postfix_expression += stack.pop();
			stack.push(operation);
		}
	}
	while (stack.length > 0)
		postfix_expression += stack.pop();
	return postfix_expression;
}

function CalculatePostfix(postfix_expression){
	let stack = new Array();
	
	for (let i = 0; i < postfix_expression.length; i++){
		let current_symbol = postfix_expression[i];
		
		if (IsDigit(current_symbol)){
			let temp_obj = GetNumberFromString(postfix_expression, i);
			let number = temp_obj.number;
			i = temp_obj.position;
			
			stack.push(Number(number));
			
		}
		else if (IsOperation(current_symbol))
		{
			if (current_symbol == "~"){
				let last_number;
				
				if (stack.length > 0) 
					last_number = stack.pop();
				else
					last_number = 0;
				
				stack.push(-last_number);
				continue;
			}
			
			let first, second;
			
			if (stack.length > 0){
				second = stack.pop();
			}
			else{
				second = 0;
			}
			
			if (stack.length > 0){
				first = stack.pop();
			}
			else{
				first = 0;
			}
			
			if (current_symbol == "+")
				stack.push(first + second)
			if (current_symbol == "-")
				stack.push(first - second)
			if (current_symbol == "*")
				stack.push(first * second)
			if (current_symbol == "/")
				stack.push(first / second)
			if (current_symbol == "^")
				stack.push(Math.pow(first, second));
		}
	}
	return stack.pop();
	
}

let [,, expression_file] = [...process.argv];

let expression = fs.readFileSync(expression_file, "utf-8");

console.log(`Postfix expression: ${ToPostfix(expression)}`);
console.log(`Result: ${CalculatePostfix(ToPostfix(expression))}`);