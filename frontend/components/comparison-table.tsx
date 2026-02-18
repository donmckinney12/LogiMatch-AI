"use client"

import { useState, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from '@tanstack/react-table'
import {
    ArrowUpDown,
    MoreHorizontal,
    Check,
    X,
    ShieldAlert,
    FileJson,
    AlertCircle,
    Mail,
    Download,
    Calculator,
    Eye,
    KeyRound,
    Cloud,
    TrendingDown,
    TrendingUp as TrendingUpIcon,
    MessageSquare
} from 'lucide-react'
import { CommentThread } from './comment-thread'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils'
import { EmailModal } from './email-modal'
import Papa from 'papaparse'

import { apiRequest } from '@/lib/api-client'
import { useOrg } from '@/context/org-context'

type Quote = {
    id: string
    carrier: string
    origin: string
    destination: string
    total_price: number
    currency: string
    normalized_total_price_usd?: number
    surcharges: any[]
    risk_flags?: string[]
    po_number?: string
    status?: string
    agent_insights?: { agent: string, finding: string, status: string }[]
    is_audited?: boolean
    audited_by?: string
    carbon_footprint_kg?: number
    transit_time_days?: number
    market_delta?: number
    is_below_market?: boolean
    filename: string
}

const columnHelper = createColumnHelper<Quote>()

export function ComparisonTable({ data, normalizationEnabled }: { data: Quote[], normalizationEnabled: boolean }) {
    const { orgId } = useOrg()
    const [sorting, setSorting] = useState<SortingState>([])
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    const [isAllocateOpen, setIsAllocateOpen] = useState(false)
    const [poNumber, setPoNumber] = useState('')

    // Exception Handling State
    const [isExceptionOpen, setIsExceptionOpen] = useState(false)
    const [exceptionReason, setExceptionReason] = useState('Vessel Delay')
    const [aiDraft, setAiDraft] = useState<any>(null)
    const [isAuditOpen, setIsAuditOpen] = useState(false)

    // Landed Cost Simulation State (Phase 6)
    const [isSimulateOpen, setIsSimulateOpen] = useState(false)
    const [hsCode, setHsCode] = useState('8471.30')
    const [simulationResult, setSimulationResult] = useState<any>(null)

    // Enterprise Readiness State (Phase 7)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [isMfaOpen, setIsMfaOpen] = useState(false)
    const [mfaCode, setMfaCode] = useState('')
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
    const [activeCommentQuote, setActiveCommentQuote] = useState<Quote | null>(null)

    const handleEmailClick = (quote: Quote) => {
        setSelectedQuote(quote)
        setIsEmailModalOpen(true)
    }

    const handleMfaVerify = () => {
        if (mfaCode === '123456') { // Mock Static MFA
            setIsMfaOpen(false)
            setMfaCode('')
            if (pendingAction) {
                pendingAction()
                setPendingAction(null)
            }
        } else {
            alert("Invalid MFA Code. Expected '123456' for demo.")
        }
    }

    const openPreview = (quote: Quote) => {
        setSelectedQuote(quote)
        setIsPreviewOpen(true)
    }

    const openException = (quote: Quote) => {
        setSelectedQuote(quote)
        setIsExceptionOpen(true)
    }

    const handleException = async () => {
        if (!selectedQuote) return
        try {
            const data = await apiRequest(`/api/shipments/exception`, {
                method: 'POST',
                body: JSON.stringify({
                    po_number: selectedQuote.po_number,
                    reason: exceptionReason
                })
            })
            setIsExceptionOpen(false)
            setAiDraft(data)
        } catch (e) {
            console.error("Exception reporting failed", e)
            alert("Failed to report exception")
        }
    }

    const handleAllocate = async () => {
        if (!selectedQuote || !poNumber) return
        try {
            await apiRequest(`/api/quotes/${selectedQuote.id}/allocate`, {
                method: 'POST',
                body: JSON.stringify({ po_number: poNumber })
            }, orgId)
            window.location.reload()
        } catch (e) {
            console.error("Allocation failed", e)
            alert("Failed to allocate PO")
        }
    }

    const handleApproveAudit = async () => {
        if (!selectedQuote) return
        try {
            await apiRequest(`/api/quotes/${selectedQuote.id}/approve-audit`, {
                method: 'POST',
                body: JSON.stringify({ user_id: 'PilotUser_01' })
            }, orgId)
            setIsAuditOpen(false)
            window.location.reload()
        } catch (e) {
            console.error("Audit approval failed", e)
            alert("Failed to approve audit")
        }
    }

    const handleChallengeRate = async () => {
        if (!selectedQuote) return
        try {
            const challenges = selectedQuote.agent_insights?.filter(i => i.status !== 'OK') || []
            const draft = await apiRequest(`/api/negotiation/challenge`, {
                method: 'POST',
                body: JSON.stringify({
                    quote: selectedQuote,
                    challenges
                })
            }, orgId)
            setIsAuditOpen(false)
            setAiDraft({
                ...draft,
                action: "Negotiation Challenge"
            })
        } catch (e) {
            console.error("Negotiation draft failed", e)
            alert("Failed to generate challenge email")
        }
    }

    const openAllocate = (quote: Quote) => {
        setSelectedQuote(quote)
        setPoNumber(quote.po_number || '')
        setIsAllocateOpen(true)
    }

    const openAudit = (quote: Quote) => {
        setSelectedQuote(quote)
        setIsAuditOpen(true)
    }

    const openSimulate = (quote: Quote) => {
        setSelectedQuote(quote)
        setSimulationResult(null)
        setIsSimulateOpen(true)
    }

    const handleSimulate = async () => {
        if (!selectedQuote || !hsCode) return
        try {
            const data = await apiRequest(`/api/quotes/${selectedQuote.id}/simulate`, {
                method: 'POST',
                body: JSON.stringify({ hs_code: hsCode })
            }, orgId)
            setSimulationResult(data.simulation)
        } catch (e) {
            console.error("Simulation failed", e)
            alert("Failed to run landed cost simulation")
        }
    }

    const handleErpSync = async (quote: Quote) => {
        if (!quote.is_audited) {
            alert("Please verify the audit findings before synchronizing with ERP.")
            return
        }

        try {
            const result = await apiRequest(`/api/erp/sync`, {
                method: 'POST',
                body: JSON.stringify({ quote_id: quote.id })
            }, orgId)
            alert(`ERP Sync Success!\nRef: ${result.erp_reference}\nSystem: ${result.details}`)
        } catch (e: any) {
            console.error("ERP sync failed", e)
            alert("ERP Sync Error: " + (e.message || "Unknown error"))
        }
    }

    const handleExportCSV = () => {
        const action = () => {
            if (!data.length) return

            const csvData = data.map(q => ({
                Carrier: q.carrier,
                Origin: q.origin,
                Destination: q.destination,
                'Original Price': `${q.total_price} ${q.currency}`,
                'Normalized Price (USD)': q.normalized_total_price_usd ? `$${q.normalized_total_price_usd.toFixed(2)}` : 'N/A',
                'Surcharge Count': q.surcharges?.length || 0,
                'Flags': q.surcharges?.filter(s => !s.normalized_name).length || 0,
                'Risk Flags': q.risk_flags?.join(', ') || ''
            }))

            const csv = Papa.unparse(csvData)
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', 'Ocean_Freight_Rate_Sheet.csv')
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }

        setPendingAction(() => action)
        setIsMfaOpen(true)
    }

    const columns = [
        columnHelper.accessor('carrier', {
            header: 'Carrier',
            cell: info => {
                const risks = info.row.original.risk_flags || []
                return (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{info.getValue() || 'Unknown'}</span>
                            {info.row.original.is_audited && (
                                <span className="flex items-center gap-1 text-[10px] bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold px-1.5 py-0.5 rounded-full" title="Verified by Human">
                                    <Check size={10} /> VERIFIED
                                </span>
                            )}
                        </div>
                        {risks.length > 0 && (
                            <div className="mt-1 flex items-start gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 p-1 rounded">
                                <ShieldAlert size={12} className="shrink-0 mt-0.5" />
                                <div className="flex flex-col">
                                    {risks.map((r, i) => <span key={i}>{r}</span>)}
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        }),
        columnHelper.accessor('origin', {
            header: 'Origin',
            cell: info => <span className="text-neutral-600 dark:text-neutral-400">{info.getValue()}</span>
        }),
        columnHelper.accessor('destination', {
            header: 'Destination',
            cell: info => <span className="text-neutral-600 dark:text-neutral-400">{info.getValue()}</span>
        }),
        columnHelper.accessor(row => row.status || 'DRAFT', {
            header: 'Status',
            cell: info => {
                const status = info.getValue()
                const po = info.row.original.po_number
                return (
                    <div className="flex flex-col">
                        <span className={cn(
                            "text-xs font-bold px-2 py-1 rounded-full w-fit",
                            status === 'ALLOCATED' ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" : "bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400"
                        )}>
                            {status}
                        </span>
                        {po && <span className="text-[10px] font-mono mt-1 text-neutral-500 dark:text-neutral-400">PO: {po}</span>}
                    </div>
                )
            }
        }),
        columnHelper.accessor((row) => normalizationEnabled ? row.normalized_total_price_usd : row.total_price, {
            id: "price",
            header: ({ column }) => {
                return (
                    <button
                        className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Price ({normalizationEnabled ? 'USD' : 'Raw'})
                        <ArrowUpDown className="h-4 w-4" />
                    </button>
                )
            },
            cell: info => {
                const val = info.getValue()
                const currency = normalizationEnabled ? 'USD' : info.row.original.currency
                const landed_duties = (info.row.original as any).estimated_duties || 0
                const landed_taxes = (info.row.original as any).estimated_taxes || 0
                const has_landed = landed_duties > 0 || landed_taxes > 0

                return (
                    <div className="flex flex-col">
                        <span className={cn(
                            "font-mono font-bold flex items-center gap-1.5",
                            normalizationEnabled ? "text-primary dark:text-blue-400" : "text-foreground"
                        )}>
                            {normalizationEnabled ? '$' : ''}{val?.toFixed(2)} {currency}
                            {currency === 'CNY' && (
                                <div className="ml-1 text-[8px] bg-red-100 text-red-600 px-1 rounded animate-pulse font-bold">
                                    VOLATILE
                                </div>
                            )}
                            {normalizationEnabled && info.row.original.market_delta !== undefined && (
                                <div className={cn(
                                    "text-[9px] px-1 py-0.5 rounded-full flex items-center gap-0.5",
                                    info.row.original.is_below_market ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                                )}>
                                    {info.row.original.is_below_market ? <TrendingDown size={8} /> : <TrendingUpIcon size={8} />}
                                    {Math.abs(info.row.original.market_delta)}%
                                </div>
                            )}
                        </span>
                        {has_landed && (
                            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded mt-1 font-bold">
                                LANDED: ${(val + landed_duties + landed_taxes).toFixed(2)}
                            </span>
                        )}
                    </div>
                )
            }
        }),
        columnHelper.accessor('transit_time_days', {
            header: 'Lead Time',
            cell: info => {
                const days = info.getValue()
                if (!days) return <span className="text-neutral-400 dark:text-neutral-500">N/A</span>
                return (
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{days} Days</span>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-tighter">
                            Est. Transit
                        </span>
                    </div>
                )
            }
        }),
        columnHelper.accessor('surcharges', {
            header: 'Surcharges',
            cell: info => {
                const surcharges = info.getValue() || []
                const flagged = surcharges.filter((s: any) => !s.normalized_name || (s.confidence && s.confidence < 0.7)).length

                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                            <span className="text-xs bg-neutral-100 dark:bg-white/10 px-2 py-1 rounded text-neutral-600 dark:text-neutral-400">
                                {surcharges.length} items
                            </span>
                            {flagged > 0 && (
                                <span className="text-xs bg-amber-100 dark:bg-amber-500/10 px-2 py-1 rounded text-amber-700 dark:text-amber-400 flex items-center gap-1 font-bold animate-pulse">
                                    <AlertCircle size={10} /> {flagged} NEEDS REVIEW
                                </span>
                            )}
                        </div>
                        {surcharges.some((s: any) => s.confidence && s.confidence < 0.7) && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium italic">
                                * Some mappings are AI-uncertain
                            </span>
                        )}
                    </div>
                )
            }
        }),
        columnHelper.accessor('carbon_footprint_kg', {
            header: 'Sustainability',
            cell: info => {
                const kg = info.getValue()
                if (!kg) return <span className="text-neutral-400 dark:text-neutral-500">N/A</span>

                const isHigh = kg > 1500
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 font-medium text-neutral-900 dark:text-white">
                            <span className={cn(isHigh ? "text-amber-600" : "text-green-600 dark:text-green-400")}>
                                {isHigh ? <AlertCircle size={14} /> : <Check size={14} />}
                            </span>
                            {kg.toFixed(0)} kg CO2
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded-full w-fit",
                            isHigh ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" : "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                        )}>
                            {isHigh ? 'HIGH IMPACT' : 'LOW CARBON'}
                        </span>
                    </div>
                )
            }
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <button
                        onClick={() => handleEmailClick(row.original)}
                        className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Draft Booking Email"
                    >
                        <Mail size={18} />
                    </button>
                    <button
                        onClick={() => setActiveCommentQuote(row.original)}
                        className="p-2 text-neutral-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors relative"
                        title="Team Discussion"
                    >
                        <MessageSquare size={18} />
                        {(row.original as any).comment_count > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-sm animate-in zoom-in duration-300">
                                {(row.original as any).comment_count}
                            </span>
                        )}
                    </button>
                    {!row.original.po_number && (
                        <button
                            onClick={() => openAllocate(row.original)}
                            className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="Allocate to PO"
                        >
                            <FileJson size={18} />
                        </button>
                    )}
                    {row.original.agent_insights && (
                        <button
                            onClick={() => openAudit(row.original)}
                            className="p-2 text-neutral-500 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                            title="View Agent Audit"
                        >
                            <ShieldAlert size={18} />
                        </button>
                    )}
                    {(row.original as any).pdf_path && (
                        <button
                            onClick={() => openPreview(row.original)}
                            className="p-2 text-neutral-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                            title="View Original PDF"
                        >
                            <Eye size={18} />
                        </button>
                    )}
                    <button
                        onClick={() => openSimulate(row.original)}
                        className="p-2 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        title="Simulate Landed Cost"
                    >
                        <Calculator size={18} />
                    </button>
                    {row.original.po_number && (
                        <button
                            onClick={() => openException(row.original)}
                            className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors animate-in fade-in"
                            title="Report Exception (AI Agent)"
                        >
                            <ShieldAlert size={18} />
                        </button>
                    )}
                    {row.original.is_audited && (
                        <button
                            onClick={() => handleErpSync(row.original)}
                            className="p-2 text-neutral-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-colors"
                            title="Sync to ERP (SAP/Oracle)"
                        >
                            <Cloud size={18} />
                        </button>
                    )}
                </div>
            )
        })
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
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={handleExportCSV}
                    disabled={!data.length}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground font-bold border-b border-border">
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
                        No quotes added yet.
                    </div>
                )}
            </div>

            <EmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                data={selectedQuote}
            />

            <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Allocate Quote to PO</DialogTitle>
                        <DialogDescription>
                            Enter the internal Purchase Order number to lock this quote.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right text-sm font-medium">PO Number</label>
                            <input
                                value={poNumber}
                                onChange={(e) => setPoNumber(e.target.value)}
                                className="col-span-3 px-3 py-2 border rounded-md"
                                placeholder="PO-2024-XXXX"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <button
                            onClick={handleAllocate}
                            className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
                        >
                            Confirm Allocation
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Exception Reporting Modal */}
            <Dialog open={isExceptionOpen} onOpenChange={setIsExceptionOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <ShieldAlert className="h-5 w-5" /> Report Shipment Exception
                        </DialogTitle>
                        <DialogDescription>
                            Trigger an AI agent response for a delay or issue with PO {selectedQuote?.po_number}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">Reason for Delay</label>
                        <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={exceptionReason}
                            onChange={(e) => setExceptionReason(e.target.value)}
                        >
                            <option value="Vessel Delay">Vessel Delay (Port Congestion)</option>
                            <option value="Customs Hold">Customs Inspection Hold</option>
                            <option value="Strike">Labor Strike at Terminal</option>
                        </select>
                    </div>
                    <DialogFooter>
                        <button
                            onClick={handleException}
                            className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 flex items-center gap-2"
                        >
                            Generate Solution
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* AI Draft Review Modal */}
            <Dialog open={!!aiDraft} onOpenChange={() => setAiDraft(null)}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-blue-600">
                            <MoreHorizontal className="h-5 w-5 animate-pulse" /> AI Agent Proposal
                        </DialogTitle>
                        <DialogDescription>
                            I've detected a schedule impact. Here is a drafted notification for the Warehouse Team.
                        </DialogDescription>
                    </DialogHeader>
                    {aiDraft && (
                        <div className="space-y-4 py-2">
                            <div className="bg-neutral-50 p-3 rounded border text-sm text-neutral-500">
                                <strong>Action:</strong> {aiDraft.action} <br />
                                <strong>Subject:</strong> {aiDraft.draft_subject}
                            </div>
                            <textarea
                                className="w-full h-48 p-3 border rounded-md font-mono text-sm bg-white"
                                defaultValue={aiDraft.draft_body}
                            />
                        </div>
                    )}
                    <DialogFooter className="gap-2 sm:justify-start">
                        <button
                            onClick={async () => {
                                try {
                                    await apiRequest('/api/email/send', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                            to: 'warehouse@logistics-demo.com',
                                            subject: aiDraft.draft_subject,
                                            body: aiDraft.draft_body
                                        })
                                    })
                                    alert("Email Sent via SendGrid!")
                                    setAiDraft(null)
                                } catch (e: any) {
                                    console.error(e)
                                    alert("Failed to send: " + (e.message || "Unknown error"))
                                }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                        >
                            Approve & Send
                        </button>
                        <button
                            onClick={() => setAiDraft(null)}
                            className="px-4 py-2 bg-white border border-neutral-300 rounded-md font-medium hover:bg-neutral-50"
                        >
                            Discard
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Agent Audit Modal */}
            <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-purple-600" /> Multi-Agent Audit Report
                        </DialogTitle>
                        <DialogDescription>
                            Technical review performed by specialized AI agents on this quote.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {selectedQuote?.agent_insights?.map((insight, idx) => (
                            <div key={idx} className={cn(
                                "p-4 rounded-lg border",
                                insight.status === 'OK' ? "bg-green-50 border-green-100" :
                                    insight.status === 'WARNING' ? "bg-amber-50 border-amber-100" :
                                        "bg-red-50 border-red-100"
                            )}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                                        {insight.agent}
                                    </span>
                                    <span className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                        insight.status === 'OK' ? "bg-green-200 text-green-800" :
                                            insight.status === 'WARNING' ? "bg-amber-200 text-amber-800" :
                                                "bg-red-200 text-red-800"
                                    )}>
                                        {insight.status}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-900 font-medium">
                                    {insight.finding}
                                </p>
                            </div>
                        ))}
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-between items-center w-full">
                        <div className="text-xs text-neutral-500 italic">
                            {selectedQuote?.is_audited ? `Verified by ${selectedQuote.audited_by}` : 'Requires Human Verification'}
                        </div>
                        <div className="flex gap-2">
                            {!selectedQuote?.is_audited && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleChallengeRate}
                                        className="px-4 py-2 bg-amber-100 text-amber-700 rounded-md font-medium hover:bg-amber-200 flex items-center gap-1"
                                    >
                                        <Mail size={14} /> Challenge Rate
                                    </button>
                                    <button
                                        onClick={handleApproveAudit}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700"
                                    >
                                        Approve Findings
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={() => setIsAuditOpen(false)}
                                className="px-4 py-2 bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800"
                            >
                                Dismiss
                            </button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Landed Cost Simulation Modal (Phase 6) */}
            <Dialog open={isSimulateOpen} onOpenChange={setIsSimulateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-indigo-600">
                            <Calculator className="h-5 w-5" /> Landed Cost Simulator
                        </DialogTitle>
                        <DialogDescription>
                            Predict duties and taxes for Quote from {selectedQuote?.carrier} to {selectedQuote?.destination}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">Harmonized System (HS) Code</label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 px-3 py-2 border rounded-md text-sm font-mono"
                                    placeholder="e.g. 8471.30"
                                    value={hsCode}
                                    onChange={(e) => setHsCode(e.target.value)}
                                />
                                <button
                                    onClick={handleSimulate}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Calculate
                                </button>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-1 italic">
                                Common: 8471.30 (Laptops), 6109.10 (T-shirts), 8517.13 (Phones)
                            </p>
                        </div>

                        {simulationResult && (
                            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center border-b border-indigo-200 pb-2">
                                    <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                                        {simulationResult.hs_description}
                                    </span>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-indigo-700">Estimated Duties</span>
                                        <span className="font-mono font-bold">${simulationResult.estimated_duties.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-indigo-700">Estimated Taxes</span>
                                        <span className="font-mono font-bold">${simulationResult.estimated_taxes.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base pt-2 border-t border-indigo-200 font-bold text-indigo-900">
                                        <span>Total Landed Cost</span>
                                        <span className="font-mono">${simulationResult.total_landed_cost.toFixed(2)}</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-indigo-500 italic mt-2">
                                    * Results are estimates based on destination country regulations.
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <button
                            onClick={() => {
                                setIsSimulateOpen(false)
                                window.location.reload() // Quick refresh to update table with duties
                            }}
                            className="w-full px-4 py-2 bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800"
                        >
                            Save Estimate to Quote
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Side-by-Side PDF Preview (Phase 7) */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="sm:max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b shrink-0">
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-orange-600" /> Side-by-Side Verification
                        </DialogTitle>
                        <DialogDescription>
                            Compare original document from {selectedQuote?.carrier} against AI-extracted findings.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 flex min-h-0">
                        {/* Original PDF View */}
                        <div className="w-1/2 border-r bg-neutral-100 flex flex-col">
                            <div className="p-2 bg-neutral-200 text-[10px] font-bold uppercase text-neutral-500 text-center shrink-0">
                                Original PDF
                            </div>
                            <iframe
                                src={`${getApiUrl()}/api/uploads/${(selectedQuote as any)?.pdf_path}`}
                                className="w-full h-full border-none rounded-2xl"
                                title="PDF Preview"
                            />
                        </div>

                        {/* Extracted Data View */}
                        <div className="w-1/2 overflow-y-auto p-6 space-y-6">
                            <div className="p-2 bg-neutral-50 text-[10px] font-bold uppercase text-neutral-500 text-center rounded border shrink-0">
                                AI Extraction Output
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Carrier</label>
                                    <p className="font-semibold">{selectedQuote?.carrier}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Total Price</label>
                                    <p className="font-mono font-bold text-blue-600">${selectedQuote?.total_price?.toFixed(2)} {selectedQuote?.currency}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Origin</label>
                                    <p className="text-sm">{selectedQuote?.origin}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Destination</label>
                                    <p className="text-sm">{selectedQuote?.destination}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Surcharges & Mapping</label>
                                <div className="space-y-1">
                                    {selectedQuote?.surcharges?.map((s: any, idx: number) => (
                                        <div key={idx} className={cn(
                                            "flex items-center justify-between p-2 rounded text-xs border",
                                            s.confidence && s.confidence < 0.7 ? "bg-amber-50 border-amber-200" : "bg-white border-neutral-100"
                                        )}>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-neutral-900">{s.raw_name}</span>
                                                <span className="text-[10px] text-neutral-500">→ {s.normalized_name || 'UNMAPPED'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono">${s.amount?.toFixed(2)}</span>
                                                {s.confidence && s.confidence < 0.7 && (
                                                    <AlertCircle size={14} className="text-amber-500" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <h4 className="text-xs font-bold text-purple-700 uppercase mb-2">Multi-Agent Audit Result</h4>
                                <div className="space-y-2">
                                    {selectedQuote?.agent_insights?.slice(0, 2).map((insight: any, idx: number) => (
                                        <div key={idx} className="text-[11px] flex gap-2">
                                            <span className="font-bold text-purple-900 shrink-0">{insight.agent}:</span>
                                            <span className="text-purple-800">{insight.finding}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-4 border-t bg-neutral-50 shrink-0">
                        <button
                            onClick={() => setIsPreviewOpen(false)}
                            className="px-6 py-2 bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800 transition-colors"
                        >
                            Validation Complete
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Mock MFA Dialog (Phase 7) */}
            <Dialog open={isMfaOpen} onOpenChange={setIsMfaOpen}>
                <DialogContent className="sm:max-w-xs">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <KeyRound className="h-5 w-5" /> Security Gate
                        </DialogTitle>
                        <DialogDescription>
                            Enter your multi-factor code to perform this sensitive action.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Authentication Code</label>
                            <input
                                value={mfaCode}
                                onChange={(e) => setMfaCode(e.target.value)}
                                className="w-full text-center text-2xl tracking-[0.5em] font-mono p-3 border rounded-lg bg-neutral-50 text-neutral-900"
                                placeholder="000000"
                                maxLength={6}
                            />
                            <p className="text-[10px] text-center text-neutral-400 italic">
                                For this demo, use: <span className="font-bold">123456</span>
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <button
                            onClick={handleMfaVerify}
                            className="w-full px-4 py-2 bg-neutral-900 text-white rounded-md font-medium hover:bg-neutral-800 transition-colors"
                        >
                            Verify & Proceed
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Team Discussion Sidebar */}
            {activeCommentQuote && (
                <CommentThread
                    quoteId={Number(activeCommentQuote.id)}
                    filename={activeCommentQuote.filename}
                    isOpen={!!activeCommentQuote}
                    onClose={() => setActiveCommentQuote(null)}
                />
            )}
        </div>
    )
}
