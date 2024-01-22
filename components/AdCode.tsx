'use client';
import React, { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function AdCode () {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = `${pathname}?${searchParams}`;

        const scriptElement = document.querySelector(
            'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2621335011919074'
        );

        const handleScriptLoad = () => {
            try {
                if (window.adsbygoogle) {
                    adsbygoogle.push({});
                } else {
                    scriptElement!.addEventListener("load", handleScriptLoad);
                }
            } catch (err) {
                console.log(err);
            }
        }

        handleScriptLoad();

        return () => {
            if (scriptElement) {
                scriptElement.removeEventListener("load", handleScriptLoad);
            }
        };
    }, [pathname, searchParams])
    return (
        <div className="container mx-auto text-center" aria-hidden={true}>
            <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client="ca-pub-2621335011919074"
            data-ad-slot="1383549022"
            data-ad-format="auto"
            data-full-width-responsive="true"
            ></ins>
            <script dangerouslySetInnerHTML={{ __html: '(window.adsbygoogle = window.adsbygoogle || []).push({});' }}></script>
        </div>
    );
};
