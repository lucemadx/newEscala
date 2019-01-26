var diasAtras = 310;
function Pessoa (nome, tipoEscala, dataEscala, postos)
{
	this.nome = nome;
	this.postos = postos;
	this.gerarFolgas = function()
	{
		var folgas = {};
		for(var i = 1; i<=diasAtras; i++)
			folgas[i] = "";

		for(var i = 1; i<=diasAtras; i++)
		{
			if(tipoEscala == 1)
			{
				if(i%10 == (dataEscala)%10)
					folgas[i] = "F";
				else
				if(i%10 == (dataEscala+1)%10)
					folgas[i] = "DSR";
				else
				if(i%10 == (dataEscala+6)%10)
					folgas[i] = "DSR";
			}
			if(tipoEscala == 2)
			{
				if(i%10 == (dataEscala)%10)
					folgas[i] = "F";
				else
				if(i%10 == (dataEscala+1)%10)
					folgas[i] = "DSR";
				else
				if(i%10 == (dataEscala+5)%10)
					folgas[i] = "DSR";
			}
			if(tipoEscala == 3)
			{
				if(i%7 == (dataEscala)%7)
					folgas[i] = "F";
				else
				if(i%7 == (dataEscala+1)%7)
					folgas[i] = "DSR";
			}
		}
		return folgas;
	};
}
var pessoas = [];

var escala = {};
var postoInicial;
var permissoes = {};

var funcionarios = [];
var postos = [];

function obterPessoaMenosEscalada(pessoasEscaladas, posto, dia)
{
	var pessoaMenosEscalada = undefined, quantidadeEscalada;

	for (var k = 0; k < pessoasEscaladas.length; k++)
	{
		if(permissoes[pessoasEscaladas[k]].length == 1 && permissoes[pessoasEscaladas[k]][0] == posto)
		{
			return pessoasEscaladas[k];
		}
		for (var permitido in permissoes[pessoasEscaladas[k]])
		{
			if(permissoes[pessoasEscaladas[k]][permitido] == posto && escala[pessoasEscaladas[k]][dia-1] != posto)
			{
				var quantidadeDias = 0;

				for (var p = 0; p < dia; p++)
				{
					if(escala[pessoasEscaladas[k]][p] == posto)
					{
						quantidadeDias++;
					}
				}
				if(quantidadeDias<quantidadeEscalada || pessoaMenosEscalada === undefined)
				{
					pessoaMenosEscalada = pessoasEscaladas[k];
					quantidadeEscalada = quantidadeDias;
				}
			}
		}
	}
	return pessoaMenosEscalada;
}

function ctrlcv()
{
	for(var posto in postos)
	{
		console.log(postos[posto]);
		for (var pessoa in funcionarios)
		{
			var quantidadeDias = 0;

			for (var p = 1; p <= diasAtras; p++)
				if(escala[funcionarios[pessoa]][p] == postos[posto])
					quantidadeDias++;

			console.log (pessoa, quantidadeDias);
		}
	}
}

function obterPessoasNãoEscaladas(dia)
{
	var lista = [];
	for(var pessoa in escala)
		if(escala[pessoa][dia] == "")
			lista.push(pessoa);
	return lista;
}


function definirPostos(dia)
{

	var pessoasEscaladasGeral = obterPessoasNãoEscaladas(dia);
	var postosHoje = [];
	var i=0;
	while(postosHoje.length<pessoasEscaladasGeral.length)
	{
		var j=0;
		var k=0;
		while(permissoes[pessoasEscaladasGeral[k]][j] != postos[i])
		{
			if(j==permissoes[pessoasEscaladasGeral[k]].length-1)
			{
				j=0;
				k++;
				if(k==pessoasEscaladasGeral.length)
					break;
			}else{
				j++;
			}
		}
		if(k!=pessoasEscaladasGeral.length)
		{
			postosHoje[postosHoje.length] = postos[i];
		}
		if(i<postos.length-1)
			i++;
	}
	var rifa = {};
	var comendo = {};

		for (var l=0; l<pessoasEscaladasGeral.length; l++)
		{
			comendo[pessoasEscaladasGeral[l]] = [];
		}
	for(var p = 0; p<postosHoje.length; p++)
	{
		for (var l=0; l<pessoasEscaladasGeral.length; l++)
		{
			for(var posto in permissoes[pessoasEscaladasGeral[l]])
			{
				if(permissoes[pessoasEscaladasGeral[l]][posto] == postosHoje[p])
					comendo[pessoasEscaladasGeral[l]].push(permissoes[pessoasEscaladasGeral[l]][posto]);
			}
		}
	}
	for (var pessoa in comendo)
	{
		if(Object.keys(comendo[pessoa]).length == 1)
		{
			escala[pessoa][dia] = comendo[pessoa][0];
			for (var f = 0; f<pessoasEscaladasGeral.length; f++)
			{
				if(pessoasEscaladasGeral[f] == pessoa)
				{
					pessoasEscaladasGeral.splice(f, 1);
				}
			}
			for (var f = 0; f<postosHoje.length; f++)
			{
				if(postosHoje[f] == comendo[pessoa][0])
				{
					postosHoje.splice(f, 1);
				}
			}
		}
	}
	for(var p = 0; p<postosHoje.length; p++)
	{
		var pessoasPermitidasHoje = [];
		for (var l=0; l<pessoasEscaladasGeral.length; l++)
		{
			for(var posto in permissoes[pessoasEscaladasGeral[l]])
			{
				if(permissoes[pessoasEscaladasGeral[l]][posto] == postosHoje[p] && escala[pessoasEscaladasGeral[l]][dia] == "")
				{
					pessoasPermitidasHoje[pessoasPermitidasHoje.length] = pessoasEscaladasGeral[l];
				}
			}
		}
		if(pessoasPermitidasHoje.length == 1)
		{
			escala[pessoasPermitidasHoje[0]][dia] = postosHoje[p];
		}
		else
		{
			if(pessoasPermitidasHoje.length > 0)
			{
				rifa[postosHoje[p]] = {};
			}
			for (var pessoa in pessoasPermitidasHoje)
			{
					if(escala[pessoasPermitidasHoje[pessoa]][dia-1]!=postosHoje[p])
					{
						var quantidadeDias = 0;
						for(var a = 0; a<dia-1; a++)
						{
							if(escala[pessoasPermitidasHoje[pessoa]][a] == postosHoje[p])
							{
								quantidadeDias++;
							}
						}
						rifa[postosHoje[p]][pessoasPermitidasHoje[pessoa]] = quantidadeDias;
					}

			}
		}
	}
		while(Object.keys(rifa).length !=0)
		{
			var menorPosto = undefined, menorPostoPessoas = 0;
			for (var posto in rifa)
			{
				if(Object.keys(rifa[posto]).length<menorPostoPessoas || menorPosto == undefined)
				{
					menorPosto = posto;
					menorPostoPessoas = Object.keys(rifa[posto]).length;
				}
			}
			var menorPessoa = undefined, menorPessoaVezes = 0;
			for (var pessoa in rifa[menorPosto])
			{
				if(rifa[menorPosto][pessoa]<menorPessoaVezes || menorPessoa == undefined)
				{
					menorPessoa = pessoa;
					menorPessoaVezes = rifa[menorPosto][pessoa];
				}
			}
			escala[menorPessoa][dia] = menorPosto;
			delete rifa[menorPosto];
				for (var posto in rifa)
				{
					delete rifa[posto][menorPessoa];
				}
		}
}


function substituiRepeticao(dia, pessoasEscaladasGeral)
{
	for (var pessoa in escala)
		if(escala[pessoa][dia] == escala[pessoa][dia-1])
		{
			for (var i = 0; i<pessoasEscaladasGeral.length; i++)
				if(pessoasEscaladasGeral[i] == pessoa)
					pessoasEscaladasGeral.splice(i, 1);

			var substituto;

			substituto = obterPessoaMenosEscalada(pessoasEscaladasGeral, escala[pessoa][dia], dia);

			var aux = escala[pessoa][dia];
			escala[pessoa][dia] = escala[substituto][dia];
			escala[substituto][dia] = aux;
		}
}

function exibeNumFuncionarioDia()
{
	document.write("<tr>");
	for (var dia in escala[pessoas[0].nome])
	{
		document.write("<td>");

		var totalPostos = 0;
		for (var pessoa in escala)
		{
			if(escala[pessoa][dia]!="F" && escala[pessoa][dia]!="DSR")
			{
				totalPostos++;
			}
		}
		document.write(totalPostos);
		document.write("</td>");
	}
	document.write("</tr>");
}

function exibe()
{
	document.write("<table border=1>");
	document.write("<tr>");

	for (var dia in escala[pessoas[0].nome])
	{
		document.write("<td>");
		document.write(dia);
		document.write("</td>");
	}
	document.write("</tr>");

	for (var pessoa in escala)
	{
		document.write("<tr>");
		for (var dia in escala[pessoa])
		{
			document.write("<td>");
			document.write(escala[pessoa][dia]);
			document.write("</td>");
		}

		document.write("<td>");
		document.write(pessoa);
		document.write("</td>");
		document.write("</tr>");
	}
	exibeNumFuncionarioDia();
	document.write("</table>");
	document.write("<a href='?'>Voltar para a página anterior</a>");
}


function init()
{
	if(postos!=null)
		for(var i = 0; i<funcionarios.length; i++)
		{
			permissoes[funcionarios[i]] = [];
			for(var j = 0; j<postos.length; j++)
			{
				if(document.getElementById(funcionarios[i]+postos[j]).checked)
				{
					permissoes[funcionarios[i]].push(postos[j]);
				}
			}
		}
	for (var i=0; i<funcionarios.length; i++)
	{
		pessoas.push(new Pessoa(funcionarios[i], parseInt(document.getElementById("sel"+funcionarios[i]).value), parseInt(document.getElementById("num"+funcionarios[i]).value), permissoes[funcionarios[i]]));
	}
	for (var i = 0; i<pessoas.length; i++)
	{
		escala[pessoas[i].nome] = pessoas[i].gerarFolgas();
	}
	if(postos !=null)
	{
		for (var dia in escala[pessoas[0].nome])
		{
			definirPostos(dia);
		}
	}
//	ctrlcv();
	exibe();
}
function gerarEquipe()
{
	funcionarios = document.getElementById("funcionarios").value.match(/^..*$/gm);
	postos = document.getElementById("postos").value.match(/^..*$/gm);
	document.getElementById("right").style.display = "initial";
	document.getElementById("escala").innerHTML = "<tr><th colspan='3'><h2>Definição de Escalas</h2></th></tr><tr><th>Nome</th><th>Tipo de Escala</th><th>Dia da 1ª Folga (F)</th></tr>";
	for (var i = 0; i<funcionarios.length; i++)
	{
		document.getElementById("escala").innerHTML += "<tr><td>"+funcionarios[i]+"</td><th><select id='sel"+funcionarios[i]+"'><option value='1'>4132</option><option value='2'>4231</option><option value='3'>5X2</option></select></th><td><input type='number' id='num"+funcionarios[i]+"' value='"+(i+1)+"'/></td></tr>";
	}
	if(postos!=null)
	{
		var stringHtml;
		stringHtml = "<tr><th colspan='"+(postos.length+1)+"'><h2>Permissao de Postos</h2></th></tr>"
		stringHtml +="<tr><td></td>";
		for (var j = 0; j<postos.length; j++)
		{
			stringHtml+="<th>"+postos[j]+"</th>"
		}
		stringHtml +="</tr>";
		for (i = 0; i<funcionarios.length; i++)
		{
			stringHtml += "<tr><td>"+funcionarios[i]+"</td>";
			for (j = 0; j<postos.length; j++)
			{
				stringHtml +="<td><input checked='true' type='checkbox' id='"+funcionarios[i]+postos[j]+"' /></td>"
			}
			stringHtml += "</tr>";
		}
		document.getElementById("funcPosto").innerHTML = stringHtml;
	}
}
gerarEquipe();
//init();
