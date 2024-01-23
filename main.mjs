import fetch from "node-fetch";
import fs from "fs";

class Cursos {
	static async Init() {
		this.auth = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJzaXN1YWx1bm8ubWVjLmdvdi5iciIsInN1YiI6IjEyNjg3NDcwNTAzIiwic2NvcGUiOlsicGhvbmUiLCJvcGVuaWQiLCJwcm9maWxlIiwiZ292YnJfZW1wcmVzYSIsImVtYWlsIl0sImFtciI6WyJwYXNzd2QiLCJjYXB0Y2hhIl0sImlzcyI6Imh0dHBzOlwvXC9zc28uYWNlc3NvLmdvdi5iclwvIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiMTI2ODc0NzA1MDMiLCJleHAiOjE3MDYwNDA2NzYsImlhdCI6MTcwNjAzOTQ3NiwianRpIjoiYmZmZTAwZDgtYmI0ZS00ZDMwLWFiNTAtNWM3YjA3OWFmMTIyIiwiY2FuZGlkYXRvIjp7Im51X2NwZiI6IjEyNjg3NDcwNTAzIiwiaW5fdHJlaW5laXJvIjoiMCIsImNvX2luc2NyaWNhb19lbmVtIjoyMzEwMDYwOTA1NDMsImR0X2NpZW50ZV9kYWRvc19jb250YXRvIjoiMjAyNC0wMS0yMiAxMzo0Mjo1Mi42ODQwMDAwIiwibnVfbm90YV9sIjoiNjMxLjkiLCJudV9ub3RhX2NoIjoiNTg0LjAiLCJudV9ub3RhX2NuIjoiNjM4LjMiLCJudV9ub3RhX20iOiI3ODQuNSIsIm51X25vdGFfciI6Ijk4MC4wIn19.EsmKy719a2ZHgp6lf6FJfHIIEeqi1cxfDEW3SwrvlFtF-Df3EbpnFpRJKVJYBXcA4Th_iiFTwWfd4Eb5I72FTHl2x2ijIoMi2wvOVH84Zu_VYCxvbl30OzmL4NwcbkDEzpwASJsgrexMPteW4yMhJpTdMxzrDsC18X5F6tlywtsAn8Cm7ZBov3VBeDs3FpIg-7iRRcHluTLOCCJOMEFroKGCMl1A0niLQdZtx08k6FOZraD8lIoKAiQ7FyBApIi1_VLK0B4xwEe6naIr37O_q3uUFssksRFXANI4tttdEBqCCaOYnTYl58UkMucUiA42sM2IXGcHWYvD2eVx_5-Upg";
		this.file = "./grades.txt";

		this.title = "Status\tMinha Nota\tNota de Corte\tDiferença\tCategoria\tTipo\tTurno\tCurso\tEstado\tCidade";

		await this.getList();

		await this.iterate();
	}

	static async getList() {
		var f = await fetch("https://sisualuno-api.sisualuno.mec.gov.br/api/v1/oferta/instituicao/3", {
			"headers": {
				"accept": "application/json, text/plain, */*",
				"authorization": this.auth,
				"content-type": "application/json"
			}
		});

		var json = await f.json();

		this.list = json;
	}

	static async iterate() {
		var names = Object.keys(this.list);

		names = names.slice(0, -1);

		var passed = 0;

		var file = "";

		for (var i = 0; i < names.length; i++) {
			var curso = this.list[names[i]];

			var grade = await this.getGrade(curso.co_oferta);

			var status = "Reprovado";

			if (grade.nu_nota_candidato > grade.modalidades[0].nu_nota_corte) {
				status = "Aprovado";
			}

			var result = [
				9, status,
				6, grade.nu_nota_candidato,
				6, grade.modalidades[0].nu_nota_corte,
				6, (parseFloat(grade.nu_nota_candidato) - parseFloat(grade.modalidades[0].nu_nota_corte)).toFixed(2),
				18, grade.modalidades[0].no_concorrencia,
				12, curso.no_grau,
				10, curso.no_turno,
				35, curso.no_curso,
				// 22, curso.no_curso,
				// 0, "\n",
				// 51, curso.no_campus,
				2, curso.sg_uf_campus,
				// 78, curso.no_ies,
				23, curso.no_municipio_campus
			];

			var text = "";

			for (var k = 1; k < result.length; k += 2) {
				if (result[k] == null) {
					result[k] = 0;
				}

				result[k] = result[k].toString();

				file += result[k] + "\t";

				while (result[k].toString().length < result[k - 1]) {
					result[k] += " ";
				}

				text += result[k] + " | ";
			}

			file += "\n";

			console.log(text);

			if (grade.nu_nota_candidato > grade.modalidades[0].nu_nota_corte) {
				passed += 1;
			}
		}

		fs.writeFileSync(this.file, this.title + "\n" + file);

		console.log("Passado Em:", passed, "De:", names.length);
	}

	static async getGrade(id) {
		var f = await fetch("https://sisualuno-api.sisualuno.mec.gov.br/api/v1/oferta/" + id + "/modalidades/candidato", {
			"headers": {
				"accept": "application/json, text/plain, */*",
				"authorization": this.auth,
				"content-type": "application/json"
			}
		});

		var json = await f.json();

		return json;
	}
}

Cursos.Init();