class RecintosZoo {
    constructor() {
        this.recintos = [
            {
                numero: 1,
                bioma: "savana",
                tamanho: 10,
                animais: [
                    { especie: "MACACO", quantidade: 3, carnivoro: false },
                ],
            },
            { numero: 2, bioma: "floresta", tamanho: 5, animais: [] },
            {
                numero: 3,
                bioma: "savana e rio",
                tamanho: 7,
                animais: [
                    { especie: "GAZELA", quantidade: 1, carnivoro: false },
                ],
            },
            { numero: 4, bioma: "rio", tamanho: 8, animais: [] },
            {
                numero: 5,
                bioma: "savana",
                tamanho: 9,
                animais: [{ especie: "LEAO", quantidade: 1, carnivoro: true }],
            },
        ];

        this.animais = {
            LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
            MACACO: {
                tamanho: 1,
                biomas: ["savana", "floresta"],
                carnivoro: false,
            },
            GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
            HIPOPOTAMO: {
                tamanho: 4,
                biomas: ["savana", "rio"],
                carnivoro: false,
            },
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animais[animal]) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        const { tamanho, biomas, carnivoro } = this.animais[animal];
        let recintosViaveis = [];

        this.recintos.forEach((recinto) => {
            // Compatibilidade de biomas com animais
            const biomaCompatível = biomas.some((b) =>
                recinto.bioma.includes(b)
            );

            if (
                biomaCompatível &&
                !this.animaisConflitantes(recinto.animais, carnivoro, animal)
            ) {
                let espacoOcupado = this.espacoOcupado(recinto.animais);
                let espacoNecessario = tamanho * quantidade;

                // Configuração de espaço extra
                const especieDiferentePresente = recinto.animais.some(
                    (a) => a.especie !== animal
                );
                if (especieDiferentePresente) {
                    espacoNecessario += 1;
                }

                const espacoLivre =
                    recinto.tamanho - espacoOcupado - espacoNecessario;

                if (espacoLivre >= 0) {
                    recintosViaveis.push({
                        numero: recinto.numero,
                        espacoLivre,
                        total: recinto.tamanho,
                    });
                }
            }
        });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        recintosViaveis.sort((a, b) => a.numero - b.numero);

        const recintosFormatados = recintosViaveis.map(
            (r) =>
                `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.total})`
        );

        return { erro: null, recintosViaveis: recintosFormatados };
    }

    animaisConflitantes(animaisExistentes, carnivoro, especie) {
        // Lógica de convivência dos carnívoros
        if (carnivoro) {
            return animaisExistentes.some((a) => a.especie !== especie);
        }

        // Lógica onde os outros animais não podem conviver com os carnívoros
        return animaisExistentes.some((a) => this.animais[a.especie].carnivoro);
    }

    espacoOcupado(animais) {
        return animais.reduce((total, animal) => {
            let espaco =
                this.animais[animal.especie].tamanho * animal.quantidade;
            return total + espaco;
        }, 0);
    }
}

export { RecintosZoo as RecintosZoo };
