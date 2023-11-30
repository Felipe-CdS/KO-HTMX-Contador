function BaseHTML(props: { children: any }) {
    return (
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script src="https://unpkg.com/htmx.org@1.9.3"></script>
                <script src="https://cdn.tailwindcss.com"></script>
                <script
                    defer
                    src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js"
                ></script>
                <title>Audicent</title>
            </head>
            <body
                class="relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden"
                style="background-image: linear-gradient(to top, #266074, #31697e, #3b7387, #457c91, #4f869b, #5c92a6, #689fb2, #75acbd, #88bfcd, #9bd2de, #afe5ee, #c4f9ff);"
            >
                {props.children}
            </body>
        </html>
    )
}

export default BaseHTML
