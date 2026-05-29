"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default function InfiniteProducts({
    initialProducts,
    currentPage,
    totalPages,
    category,
    subCategory,
    keyword,
}) {

    const [products, setProducts] = useState(initialProducts || []);
    const [page, setPage] = useState(currentPage || 1);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const fetchingRef = useRef(false);

    useEffect(() => {

        setProducts(initialProducts || []);
        setPage(currentPage || 1);

    }, [initialProducts, currentPage]);

    useEffect(() => {

        const handleScroll = async () => {

            if (loading || fetchingRef.current) {
                return;
            }

            if (page >= totalPages) return;

            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.body.scrollHeight;

            if (scrollTop + windowHeight + 1200 >= fullHeight) {

                setLoading(true);
                fetchingRef.current = true;

                try {

                    const nextPage = page + 1;

                    const params = new URLSearchParams();

                    params.set("page", nextPage);
                    params.set("limit", 20);

                    if (category) {
                        params.set("category", category);
                    }

                    if (subCategory) {
                        params.set("subCategory", subCategory);
                    }

                    if (keyword) {
                        params.set("keyword", keyword);
                    }

                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`
                    );

                    const data = await res.json();

                    setProducts((prev) => {

                        const existingIds = new Set(
                            prev.map((item) => item._id)
                        );

                        const uniqueProducts = (data.products || []).filter(
                            (item) => !existingIds.has(item._id)
                        );

                        return [
                            ...prev,
                            ...uniqueProducts,
                        ];
                    });

                    setPage(nextPage);

                    window.history.replaceState(
                        {},
                        "",
                        `/products`
                    );

                } catch (error) {
                    console.log(error);
                }
                setTimeout(() => {

                    fetchingRef.current = false;
                    setLoading(false);

                }, 500);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, [
        page,
        totalPages,
        loading,
        category,
        subCategory,
        keyword,
        router,
    ]);

    const changePage = async (targetPage) => {

        if (targetPage < 1 || targetPage > totalPages) {
            return;
        }

        setLoading(true);

        try {

            const params = new URLSearchParams();

            params.set("page", targetPage);
            params.set("limit", 20);

            if (category) {
                params.set("category", category);
            }

            if (subCategory) {
                params.set("subCategory", subCategory);
            }

            if (keyword) {
                params.set("keyword", keyword);
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`
            );

            const data = await res.json();

            setProducts(data.products || []);

            setPage(targetPage);

            window.location.href =
    `/products?page=${targetPage}`

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    return (
        <>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                    />
                ))}

            </div>

            <div className="mt-14 mb-10 flex flex-wrap items-center justify-center gap-6">

                <button
                    onClick={() => changePage(page - 1)}
                    disabled={page <= 1}
                    className="rounded-xl border border-[#d1d5db] bg-white px-8 py-4 text-[18px] font-semibold text-[#111827] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    ← Previous
                </button>

                <div className="text-[20px] font-semibold text-[#111827]">
                    Page {page} of {totalPages}
                </div>

                <button
                    onClick={() => changePage(page + 1)}
                    disabled={page >= totalPages}
                    className="rounded-xl border border-[#d1d5db] bg-white px-8 py-4 text-[18px] font-semibold text-[#111827] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Next →
                </button>

            </div>

            {loading && (
                <div className="pb-10 text-center text-lg font-bold text-sky-600">
                    Loading more products...
                </div>
            )}

        </>
    );
}