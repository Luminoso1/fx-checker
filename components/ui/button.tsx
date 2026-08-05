import { cn } from '@/lib/utils'

interface Props extends React.ComponentProps<'button'> {
  ref?: React.Ref<HTMLButtonElement>
}

export const Button = ({ children, className, ref, ...rest }: Props) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn('cursor-pointer', 'outlined rounded-lg', className)}
      {...rest}
    >
      {children}
    </button>
  )
}
