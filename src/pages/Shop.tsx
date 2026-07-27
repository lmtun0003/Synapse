import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/Button'
import { Pill } from '@/components/ui/Badge'
import { BATTLE_PASS, SHOP_CATALOG } from '@/data/shop'
import { usePlayerStore } from '@/stores/playerStore'

export function ShopPage() {
  const { sparks, prisms, ownedCosmetics, purchaseItem, equipCosmetic, equippedTheme } =
    usePlayerStore()

  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Shop</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">Cosmetics only</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Sparks and Prisms never buy power — only expression. Fair play is non-negotiable.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Pill>✦ {sparks} Sparks</Pill>
        <Pill>◇ {prisms} Prisms</Pill>
      </div>

      <GlassPanel className="mt-8" padding="lg">
        <Pill>Season {BATTLE_PASS.season}</Pill>
        <h2 className="mt-3 text-2xl font-light">{BATTLE_PASS.name}</h2>
        <p className="mt-2 text-sm text-muted">
          {BATTLE_PASS.levels} reward levels · {BATTLE_PASS.durationDays} days · {BATTLE_PASS.description}
        </p>
      </GlassPanel>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {SHOP_CATALOG.map((item) => {
          const owned = ownedCosmetics.includes(item.id)
          return (
            <GlassPanel key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-faint">{item.category}</p>
                  <h3 className="mt-2 text-lg font-medium">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
                {item.premium && <Pill>Premium</Pill>}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm text-muted">
                  {item.price} {item.currency === 'sparks' ? 'Sparks' : 'Prisms'}
                </p>
                {owned ? (
                  <Button
                    size="sm"
                    variant={equippedTheme === item.id ? 'primary' : 'secondary'}
                    onClick={() => {
                      if (item.category === 'theme') equipCosmetic('theme', item.id)
                      if (item.category === 'board') equipCosmetic('board', item.id)
                    }}
                  >
                    {equippedTheme === item.id ? 'Equipped' : 'Equip'}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => purchaseItem(item.id, item.currency, item.price)}
                  >
                    Acquire
                  </Button>
                )}
              </div>
            </GlassPanel>
          )
        })}
      </div>
    </div>
  )
}
