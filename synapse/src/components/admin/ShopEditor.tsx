import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { useGameStore } from '@/store/gameStore'
import { COSMETIC_TYPES, COSMETIC_TYPE_LABELS } from '@/data/shopItems'
import { AdminLabel, AdminInput, AdminTextarea, AdminSelect, AdminCard, AdminToggle } from './AdminShared'
import type { ShopItem, CosmeticType } from '@/types/game'

const EMPTY_ITEM: Omit<ShopItem, 'id'> = {
  name: '',
  description: '',
  type: 'theme',
  preview: '✦',
  sparkCost: 200,
  limited: false,
  new: false,
}

function ItemRow({ item, onEdit, onDelete }: {
  item: ShopItem
  onEdit: (item: ShopItem) => void
  onDelete: (id: string) => void
}) {
  return (
    <motion.div
      layout
      className="flex items-center gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 transition-colors group"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
    >
      {/* Preview */}
      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
        {item.preview}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium truncate">{item.name}</span>
          {item.new && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-md border border-blue-500/25">NEW</span>}
          {item.limited && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-md border border-amber-500/25">LIMITED</span>}
        </div>
        <div className="text-white/35 text-xs truncate">{COSMETIC_TYPE_LABELS[item.type]} · {item.description}</div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        {item.sparkCost ? (
          <div className="text-amber-400 text-sm font-semibold">✦ {item.sparkCost}</div>
        ) : item.prismCost ? (
          <div className="text-blue-400 text-sm font-semibold">◈ {item.prismCost}</div>
        ) : (
          <div className="text-white/20 text-sm">Free</div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(item)}
          className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center text-xs transition-all"
          title="Edit"
        >✏️</button>
        <button
          onClick={() => onDelete(item.id)}
          className="w-7 h-7 rounded-lg bg-red-500/8 hover:bg-red-500/20 text-red-400/60 hover:text-red-400 flex items-center justify-center text-xs transition-all"
          title="Delete"
        >✕</button>
      </div>
    </motion.div>
  )
}

function ItemModal({ item, onSave, onClose }: {
  item: Partial<ShopItem> & { id?: string }
  onSave: (item: ShopItem) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<Partial<ShopItem>>({ ...EMPTY_ITEM, ...item })
  const isNew = !item.id

  const update = (patch: Partial<ShopItem>) => setDraft(d => ({ ...d, ...patch }))

  const handleSave = () => {
    if (!draft.name?.trim()) return
    const newItem: ShopItem = {
      id: item.id ?? `shop_${Date.now()}`,
      name: draft.name ?? '',
      description: draft.description ?? '',
      type: draft.type ?? 'theme',
      preview: draft.preview ?? '✦',
      sparkCost: draft.prismCost ? undefined : (draft.sparkCost ?? 200),
      prismCost: draft.prismCost,
      limited: draft.limited ?? false,
      new: draft.new ?? false,
    }
    onSave(newItem)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md bg-[#111115] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.96, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h3 className="text-white font-bold">{isNew ? '+ New Shop Item' : 'Edit Shop Item'}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {/* Preview + name row */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <AdminLabel>Icon</AdminLabel>
              <AdminInput
                value={draft.preview ?? ''}
                onChange={e => update({ preview: e.target.value })}
                className="w-16 text-center text-2xl"
                maxLength={4}
                placeholder="✦"
              />
            </div>
            <div className="flex-1">
              <AdminLabel>Name *</AdminLabel>
              <AdminInput
                value={draft.name ?? ''}
                onChange={e => update({ name: e.target.value })}
                placeholder="Item name"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <AdminLabel>Description</AdminLabel>
            <AdminTextarea
              rows={2}
              value={draft.description ?? ''}
              onChange={e => update({ description: e.target.value })}
              placeholder="What does this item do?"
            />
          </div>

          {/* Type */}
          <div>
            <AdminLabel>Category</AdminLabel>
            <AdminSelect value={draft.type ?? 'theme'} onChange={e => update({ type: e.target.value as CosmeticType })}>
              {COSMETIC_TYPES.map(t => (
                <option key={t} value={t}>{COSMETIC_TYPE_LABELS[t]}</option>
              ))}
            </AdminSelect>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <AdminLabel>Spark Cost ✦</AdminLabel>
              <AdminInput
                type="number"
                min={0}
                step={50}
                value={draft.sparkCost ?? ''}
                onChange={e => update({ sparkCost: Number(e.target.value) || undefined, prismCost: undefined })}
                placeholder="0 = free"
              />
            </div>
            <div>
              <AdminLabel>Prism Cost ◈</AdminLabel>
              <AdminInput
                type="number"
                min={0}
                step={10}
                value={draft.prismCost ?? ''}
                onChange={e => update({ prismCost: Number(e.target.value) || undefined, sparkCost: undefined })}
                placeholder="Leave empty if Spark"
              />
            </div>
          </div>

          {/* Flags */}
          <div className="bg-white/3 rounded-xl p-3 flex flex-col gap-0">
            <AdminToggle label="New badge" description="Shows 'NEW' badge on the item" enabled={draft.new ?? false} onChange={() => update({ new: !draft.new })} />
            <AdminToggle label="Limited time" description="Shows 'LIMITED' badge, item expires" enabled={draft.limited ?? false} onChange={() => update({ limited: !draft.limited })} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!draft.name?.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm text-white bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_12px_rgba(59,130,246,0.35)]"
          >
            {isNew ? '+ Add Item' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ShopEditor() {
  const { shopItems, addShopItem, updateShopItem, deleteShopItem } = useGameStore()
  const [editingItem, setEditingItem] = useState<Partial<ShopItem> & { id?: string } | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<CosmeticType | 'all'>('all')

  const filtered = shopItems.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || item.type === filterType
    return matchSearch && matchType
  })

  const handleSave = (item: ShopItem) => {
    if (editingItem?.id && shopItems.find(i => i.id === editingItem.id)) {
      updateShopItem(item.id, item)
    } else {
      addShopItem(item)
    }
    setEditingItem(null)
  }

  const totalSparksValue = shopItems.filter(i => i.sparkCost).reduce((s, i) => s + (i.sparkCost ?? 0), 0)
  const totalPrismsValue = shopItems.filter(i => i.prismCost).reduce((s, i) => s + (i.prismCost ?? 0), 0)

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white/4 rounded-xl p-3 text-center border border-white/8">
          <div className="text-white text-xl font-bold">{shopItems.length}</div>
          <div className="text-white/40 text-xs">Total Items</div>
        </div>
        <div className="bg-amber-500/5 rounded-xl p-3 text-center border border-amber-500/15">
          <div className="text-amber-400 text-xl font-bold">{shopItems.filter(i => i.sparkCost).length}</div>
          <div className="text-white/40 text-xs">Spark Items</div>
        </div>
        <div className="bg-blue-500/5 rounded-xl p-3 text-center border border-blue-500/15">
          <div className="text-blue-400 text-xl font-bold">{shopItems.filter(i => i.prismCost).length}</div>
          <div className="text-white/40 text-xs">Prism Items</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <AdminInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items…"
            className="pl-8"
          />
        </div>
        <AdminSelect
          value={filterType}
          onChange={e => setFilterType(e.target.value as CosmeticType | 'all')}
          className="w-36"
        >
          <option value="all">All Types</option>
          {COSMETIC_TYPES.map(t => <option key={t} value={t}>{COSMETIC_TYPE_LABELS[t]}</option>)}
        </AdminSelect>
        <button
          onClick={() => setEditingItem({})}
          className="px-4 py-2.5 rounded-xl text-sm text-white bg-blue-500 hover:bg-blue-400 transition-colors flex-shrink-0 whitespace-nowrap shadow-[0_0_12px_rgba(59,130,246,0.3)]"
        >
          + Add Item
        </button>
      </div>

      {/* Items list */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <div className="flex items-center px-4 py-2.5 border-b border-white/6 bg-white/2">
          <span className="text-white/30 text-xs uppercase tracking-wider flex-1">Item</span>
          <span className="text-white/30 text-xs uppercase tracking-wider w-20 text-right">Price</span>
          <span className="w-16" />
        </div>
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-white/25 text-sm">No items found</div>
          ) : (
            filtered.map(item => (
              <ItemRow
                key={item.id}
                item={item}
                onEdit={setEditingItem}
                onDelete={deleteShopItem}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="text-white/20 text-xs mt-3 text-right">
        {filtered.length} of {shopItems.length} items shown
      </div>

      {/* Modal */}
      <AnimatePresence>
        {editingItem !== null && (
          <ItemModal
            item={editingItem}
            onSave={handleSave}
            onClose={() => setEditingItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
