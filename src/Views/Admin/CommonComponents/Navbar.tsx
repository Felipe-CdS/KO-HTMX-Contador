function Navbar() {
    return (
        <div class="flex w-full items-center justify-center bg-[#212529] py-2">
            <div class="flex w-8/12 items-center justify-between">
                <div class="flex items-center">
                    <a class="mr-4 flex h-8 items-center text-xl text-white" href="/admin/home">
                        <img class="mr-2" src="./assets/cropped-audicent_logo-32x32.png" />
                        Audicent
                    </a>
                    <a
                        class="mx-2 flex h-8 items-center text-base text-gray-400 hover:text-gray-200"
                        href="/admin/users"
                    >
                        Usuários
                    </a>
                    <a
                        class="mx-2 flex h-8 items-center text-base text-gray-400 hover:text-gray-200"
                        href="/admin/users"
                    >
                        Anexos
                    </a>
                    <a
                        class="mx-2 flex h-8 items-center text-base text-gray-400 hover:text-gray-200"
                        href="/admin/users"
                    >
                        Seguradoras
                    </a>
                    <a
                        class="mx-2 flex h-8 items-center text-base text-gray-400 hover:text-gray-200"
                        href="/admin/users"
                    >
                        Configurações
                    </a>
                </div>
                <div class="flex items-center">
                    <span class="mr-1 text-sm text-gray-400">
                        Logado como: <span class="text-sm text-white underline">ADMIN</span>
                    </span>
                    <button class="ml-2 h-10 rounded-md border border-yellow-500 px-3 text-base text-yellow-500 transition-all hover:bg-yellow-500 hover:text-[#212529]">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar
