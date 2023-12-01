import BaseHTML from '../../BaseHTML'
import Navbar from '../CommonComponents/Navbar'

function TransactionDetails() {
    return (
        <BaseHTML>
            <Navbar />
            <div class="my-4 flex w-8/12 flex-col items-center rounded-3xl bg-white p-8">
                <div class="mb-6 flex w-full justify-between">
                    <div class="flex flex-col items-start justify-center px-3">
                        <h5 class="mb-2 text-xl text-[#212529]">Envio Detalhado</h5>

                        <h1 class="text-4xl font-bold text-[#212529]">&emsp;A8</h1>
                    </div>
                    <div class="flex flex-col items-end justify-center px-3 ">
                        <h5 class="mb-2 text-xl text-[#212529]">Anexo 3</h5>
                        <h5 class="text-xl text-[#212529]">Mar/2023</h5>
                    </div>
                </div>
                <table class="w-full table-auto border text-center text-[#212529]">
                    <thead>
                        <tr>
                            <th colspan={2} class="border p-2 leading-6">
                                Resumo do Cálculo Simples de Corretagem
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-gray-100 leading-6">
                            <td class="border p-2">Faturamento Acumulado (RBT12):</td>
                            <td class="border p-2 font-bold">R$&nbsp;294.356,33</td>
                        </tr>
                        <tr>
                            <td class="border p-2">Comissão Bruta Total:</td>
                            <td class="border p-2 font-bold">R$&nbsp;23.928,65</td>
                        </tr>
                        <tr class="bg-gray-100 leading-6">
                            <td class="border p-2">Alíquota (8.02):</td>
                            <td class="border p-2 font-bold">R$&nbsp;1.919,12</td>
                        </tr>
                        <tr>
                            <td class="border p-2">ISS Retido (2.57%):</td>
                            <td class="border p-2 font-bold">R$&nbsp;614,12</td>
                        </tr>
                        <tr class="bg-gray-100 leading-6">
                            <td class="border p-2">Total do DAS:</td>
                            <td class="border p-2 font-bold">R$&nbsp;1.305,00</td>
                        </tr>
                    </tbody>
                </table>
                <hr class="my-5 w-[95%] border-t border-gray-300" />
                <div class="mb-4 flex h-10 w-full justify-between border"></div>
                <button class="mb-2 w-full rounded-md bg-green-700 px-3 py-1.5 text-white">
                    Nova Comissão
                </button>
                <button class="w-full rounded-md bg-blue-600 px-3 py-1.5 text-white">
                    Documentos do Envio
                </button>
            </div>
        </BaseHTML>
    )
}

export default TransactionDetails
