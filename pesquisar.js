import fs from "fs";

class Pesquisar {
	static Init() {
		this.file = "selecionados.json";

		this.read();

		this.format();

		// this.sort({
		// 	// universidade: "UNIVERSIDADE FEDERAL DE SERGIPE",
		// 	// curso: "SISTEMAS DE INFORMAÇÃO"
		// 	// nome: "JOAO GUILHERME SANTOS SILVA"
		// }, function(a, b) {
		// 	return b.nota - a.nota;
		// }, function(result) {
		// 	var max = 0;
		// 	var min = Infinity;

		// 	for (var i = 0; i < result.length; i++) {
		// 		if (result[i].nota > max) {
		// 			max = result[i].nota;
		// 		}
		// 		if (result[i].nota < min) {
		// 			min = result[i].nota;
		// 		}
		// 	}

		// 	console.log(result[0]);
		// 	console.log(result[result.length - 1]);
		// 	console.log("Máximo:", max);
		// 	console.log("Mínimo:", min);
		// });

		var context = this;

		this.sort({
			curso: "SISTEMAS DE INFORMAÇÃO",
			sigla: this.formatName("ufs"),
			modalidade: "Ampla concorrência"
			// nome: this.formatName("Ellen Yasmin da Silva")
		}, function(a, b) {
			return b.notaReal - a.notaReal;
		}, function(result) {
			// result = result.filter(function(item) {
			// 	if (item.nome.split(" ")[0] == "GUILHERME") {
			// 		if (item.curso.includes("ENGENHARIA")) {
			// 			return item;
			// 		}
			// 	}
			// });

			for (var i = 0; i < result.length; i++) {
				if (result[i].nome == context.formatName("João Guilherme Santos Silva")) {
					console.log(result[i]);
					console.log(i + 1, "/", result.length);
				}

				// console.log({
				// 	"nota": result[i].nota,
				// 	"notaReal": result[i].notaReal,
				// 	"nome": result[i].nome,
				// 	"modalidade": result[i].modalidade,
				// 	"classificação": result[i].classificação,
				// 	"curso": result[i].curso
				// });
			}

			console.log(result.length);
		});
	}

	static read() {
		this.instituições = JSON.parse(fs.readFileSync(this.file));
	}

	static format() {
		var result = [];

		for (var i = 0; i < this.instituições.length; i++) {
			var instituição = this.instituições[i];

			for (var o = 0; o < instituição.ofertas.length; o++) {
				var oferta = instituição.ofertas[o];

				for (var s = 0; s < oferta.selecionados.length; s++) {
					result.push({
						nota: oferta.selecionados[s].nota,
						notaReal: oferta.selecionados[s].notaReal,
						bonus: oferta.selecionados[s].bonus,
						nome: oferta.selecionados[s].nome,
						modalidade: oferta.selecionados[s].modalidade,
						classificação: oferta.selecionados[s].classificação,
						universidade: instituição.nome,
						estado: oferta.estado,
						sigla: instituição.sigla,
						campus: oferta.campus,
						curso: oferta.curso,
						grau: oferta.grau,
						turno: oferta.turno
					});
				}
			}
		}

		this.result = result;
	}

	static sort(filter, sort, show) {
		var result = this.result;

		var list = Object.keys(filter);

		result = result.filter(function(item) {
			for (var i = 0; i < list.length; i++) {
				if (filter[list[i]]) {
					var parameter = item[list[i]];

					while (parameter[0] == " ") {
						parameter = parameter.slice(1);
					}
					while (parameter[parameter.length - 1] == " ") {
						parameter = parameter.slice(0, -1);
					}

					if (parameter != filter[list[i]]) return;
				}
			}

			return item;
		});

		show(result.sort(sort));
	}

	static formatName(name) {
		var L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var l = "abcdefghijklmnopqrstuvwxyz";

		var a = "óéíã";
		var A = "OEIA";

		var result = "";

		for (var i = 0; i < name.length; i++) {
			if (L.includes(name[i])) {
				result += name[i];
			}

			if (l.includes(name[i])) {
				result += L[l.indexOf(name[i])];
			}

			if (name[i] == " ") {
				result += name[i];
			}

			if (a.includes(name[i])) {
				result += A[a.indexOf(name[i])];
			}
		}

		return result;
	}
}

Pesquisar.Init();