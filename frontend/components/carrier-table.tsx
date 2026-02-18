"use client"

import { useState, useEffect } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, Truck, Phone, Star, MoreHorizontal, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

type Carrier = {
    id: number
    name: string
    contact_info: string
    reliability_score: number
    quote_count: number
}

const columnHelper = createColumnHelper<Carrier>()

import { apiRequest } from '@/lib/api-client'

export function CarrierTable() {
    const [data, setData] = useState<Carrier[]>([])
    const [sorting, setSorting] = useState<SortingState>([])

    useEffect(() => {
        fetchCarriers()
    }, [])

    const fetchCarriers = async () => {
        try {
            const carriers = await apiRequest('/api/carriers')
            setData(carriers)
        } catch (e) {
            console.error("Failed to fetch carriers", e)
        }
    }

    const columns = [
        columnHelper.accessor('name', {
            header: 'Carrier Name',
            cell: info => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-xs">
                        {info.getValue().substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-neutral-900 dark:text-white">{info.getValue()}</span>
                </div>
            )
        }),
        columnHelper.accessor('contact_info', {
            header: 'Contact Info',
            cell: info => (
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Mail size={14} />
                    <span>{info.getValue() || 'No contact info'}</span>
                </div>
            )
        }),
        columnHelper.accessor('quote_count', {
            header: 'Quotes Processed',
            cell: info => <span className="text-neutral-900 dark:text-neutral-300 font-mono">{info.getValue()}</span>
        }),
        columnHelper.accessor('reliability_score', {
            id: 'reliability',
            header: ({ column }) => {
                return (
                    <button
                        className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Reliability
                        <ArrowUpDown className="h-4 w-4" />
                    </button>
                )
            },
            cell: info => {
                const score = info.getValue()
                let color = "text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400"
                if (score < 80) color = "text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400"
                if (score < 50) color = "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400"

                return (
                    <span className={cn("px-2 py-1 rounded font-medium text-xs", color)}>
                        {score.toFixed(1)}%
                    </span>
                )
            }
        }),
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    })

    return (
        <div className="rounded-xl border border-neutral-200 dark:border-white/10 overflow-hidden bg-white dark:bg-neutral-900 shadow-sm glass-card">
            <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 font-medium border-b border-neutral-200 dark:border-white/10">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="px-6 py-4 font-medium">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-6 py-4">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length === 0 && (
                <div className="p-12 text-center text-neutral-400">
                    No carriers found. Upload quotes to populate.
                </div>
            )}
        </div>
    )
}
