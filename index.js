const { createApp } = Vue;

createApp({
    data() {
        return {
            pokemons: [],
            loading: true,
            searchText: '',
            nextPage: 1,
        };
    },
    computed: {
        filteredPokemons() {
            return this.pokemons.filter(pokemon =>
                pokemon.name.toLowerCase().includes(this.searchText.toLowerCase())
            );
        }
    },
    created() {
        this.callAPI();
        window.addEventListener('scroll', this.handleScroll);
    },
    mounted() {
        this.$refs.pokemonContainer.addEventListener('scroll', this.handleScroll);
    },
    unmounted() {
        this.$refs.pokemonContainer.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        async callAPI() {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${(this.nextPage - 1) * 151}&limit=151`);
                const data = await response.json();
                const pokemonDetailsPromises = data.results.map(async pokemon => this.fetchPokemonData(pokemon.url));
                const pokemonDetails = await Promise.all(pokemonDetailsPromises);
                this.pokemons = [...this.pokemons, ...pokemonDetails];
                this.nextPage++;
                this.loading = false;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchPokemonData(url) {
            try {
                const response = await fetch(url);
                const data = await response.json();
                return {
                    id: data.id,
                    name: data.name,
                    types: data.types,
                    sprites: data.sprites,
                };
            } catch (e) {
                console.error(e);
            }
        },
        handleScroll() {
            const container = this.$refs.pokemonContainer;
            const bottomOfContainer = container.scrollTop + container.clientHeight >= container.scrollHeight;

            if (bottomOfContainer && !this.loading) {
                this.loading = true;
                this.callAPI();
            }
        },
        getTypeClass(type) {
            const classTypeMap = {
                fire: 'fire',
                grass: 'grass',
                water: 'water',
                bug: 'bug',
                normal: 'normal',
                poison: 'poison',
                electric: 'electric',
                ground: 'ground',
                ghost: 'ghost',
                fighting: 'fighting',
                psychic: 'psychic',
                rock: 'rock',
                ice: 'ice',
                steel: 'steel',
                dark: 'dark',
                flying: 'flying',
                fairy: 'fairy',
                dragon: 'dragon',
            };
            return classTypeMap[type] || '';
        },
        getGradientClass(types) {
            if (types.length > 1) {
                const type1Color = this.getTypeColor(types[0].type.name);
                const type2Color = this.getTypeColor(types[1].type.name);
                return {
                    background: `linear-gradient(135deg, ${type1Color}, ${type2Color})`
                };
            } else {
                const type1Color = this.getTypeColor(types[0].type.name);
                return {
                    background: `linear-gradient(135deg, ${type1Color}, #fff)`
                };
            }
        },
        getTypeColor(type) {
            const typeColorMap = {
                fire: '#c27e10',
                grass: '#4CAF50',
                water: '#00BFFF',
                bug: '#98e880',
                normal: '#A9A9A9',
                poison: '#9e5cda',
                electric: '#ffd365',
                ground: '#9e7e52',
                ghost: '#5626de',
                fighting: '#ba082a',
                psychic: '#e39fa4',
                rock: '#897975',
                ice: '#42bed3',
                steel: '#999999',
                dark: '#12124f',
                flying: '#23f1c7',
                fairy: '#f040f3',
                dragon: '#3263cc'
            };
            return typeColorMap[type] || '#ffffff';
        },
    }
}).mount("#app");
