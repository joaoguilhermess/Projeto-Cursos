import fetch from "node-fetch";
import fs from "fs";

class Baixar {
	static async Init() {
		this.file = "selecionados.json";

		var result = [];

		var instituições = await this.getInstituições();

		instituições = instituições.sort(function(a, b) {
			if (b.sg_uf > a.sg_uf) {
				return -1;
			} else {
				return 1;
			}
		});

		for (var i = 0; i < instituições.length; i++) {
			var universidade = {
				nome: instituições[i].no_ies,
				sigla: instituições[i].sg_ies,
				ofertas: []
			}

			var list = await this.getOfertas(instituições[i].co_ies);

			var ofertas = [];

			for (var o = 0; o < Object.keys(list).length - 1; o++) {
				ofertas.push(list[o]);
			}

			ofertas = ofertas.sort(function(a, b) {
				if (b.no_campus > a.no_campus) {
					return -1;
				} else {
					return 1;
				}
			});

			for (var o = 0; o < ofertas.length; o++) {
				console.log(
					ofertas[o].sg_uf_campus,
					"|",
					ofertas[o].no_campus,
					"|",
					ofertas[o].no_curso,
					"|",
					ofertas[o].no_grau,
					"|",
					ofertas[o].no_turno
				);

				var oferta = {
					estado: ofertas[o].sg_uf_campus,
					campus: ofertas[o].no_campus,
					curso: ofertas[o].no_curso,
					cidade: ofertas[o].no_municipio_campus,
					grau: ofertas[o].no_grau,
					turno: ofertas[o].no_turno,
					selecionados: []
				};

				var selecionados = await this.getSelecionados(ofertas[o].co_oferta);

				for (var s = 0; s < selecionados.length; s++) {
					var selecionado = ({
						nome: selecionados[s].no_inscrito,
						nota: parseFloat(selecionados[s].nu_nota_candidato),
						notaReal: parseFloat((parseFloat(selecionados[s].nu_nota_candidato) * (1 - parseFloat(selecionados[s].qt_bonus_perc)/100)).toFixed(2)),
						bonus: parseFloat(selecionados[s].qt_bonus_perc)/100,
						classificação: selecionados[s].nu_classificacao
					});

					if ("Ampla concorrência" == selecionados[s].no_mod_concorrencia) {
						selecionado.modalidade = "Ampla concorrência";
					} else {
						selecionado.modalidade = "Cotas";
					}

					oferta.selecionados.push(selecionado);
				}

				universidade.ofertas.push(oferta);
			}

			result.push(universidade);
		}

		fs.writeFileSync(this.file, JSON.stringify(result, null, "\t"));
	}

	static async getInstituições() {
		var f = await fetch("https://sisu-api.sisu.mec.gov.br/api/v1/oferta/instituicoes");

		var json = await f.json();

		return json;
	}

	static async getOfertas(instituição) {
		var f = await fetch("https://sisu-api.sisu.mec.gov.br/api/v1/oferta/instituicao/" + instituição);

		var json = await f.json();

		return json;
	}

	static async getSelecionados(curso) {
		var f = await fetch("https://sisu-api.sisu.mec.gov.br/api/v1/oferta/" + curso + "/selecionados");

		var json = await f.json();

		return json;
	}
}

Baixar.Init();