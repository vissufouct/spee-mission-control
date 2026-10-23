// Adapted from shadcn/ui (MIT): local source, Radix Slot and CVA variants.
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
const variants = cva('inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 shrink-0', {
  variants: {
    variant: { default: 'bg-primary text-white hover:bg-blue-700', outline: 'border border-slate-300 bg-white text-blue-700 hover:bg-blue-50', ghost: 'text-slate-600 hover:bg-slate-100', destructive: 'bg-red-700 text-white hover:bg-red-800' },
    size: { default: 'min-h-10 px-4 py-2', sm: 'min-h-9 px-3 py-1.5', icon: 'size-10' },
  }, defaultVariants: { variant: 'default', size: 'default' },
})
export function Button({ className, variant, size, asChild = false, ...props }: ComponentProps<'button'> & VariantProps<typeof variants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(variants({ variant, size }), className)} {...props} />
}

