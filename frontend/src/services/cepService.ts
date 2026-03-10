type CepResponse = {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

function normalizeCep(value: string) {
  return value.replace(/\D/g, '')
}

export const cepService = {
  async getAddressByCep(cep: string) {
    const normalizedCep = normalizeCep(cep)

    if (normalizedCep.length !== 8) {
      throw new Error('CEP inválido')
    }

    const response = await fetch(`https://viacep.com.br/ws/${normalizedCep}/json/`)

    if (!response.ok) {
      throw new Error('Não foi possível consultar o CEP')
    }

    const data = (await response.json()) as CepResponse

    if (data.erro) {
      throw new Error('CEP não encontrado')
    }

    return {
      cep: data.cep,
      street: data.logradouro,
      complement: data.complemento,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    }
  },
}
