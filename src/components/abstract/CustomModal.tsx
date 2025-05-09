/**
 * Modal component to show a modal
 *
 * @param children the main content
 * @param show state variable to show the modal
 * @param closeHandler the function to close the modal
 *
 * This component will render a fixed div with a semi-transparent background
 * and a pointer event that will call the closeHandler when clicked.
 *
 * The component will also render the `children` prop.
 *
 * If the `show` prop is `false`, the component will return `null`.
 *
 * The component will also render a small paragraph with the text
 * "Click anywhere to close" in the top right corner of the modal.
 *
 * @example
 * import { Modal } from "./components";
 *
 * <Modal onClose={() => setOpen(false)}>
 *   <p>Main content inside the modal</p>
 * </Modal>
 */
export default function CustomModal({
	children,
	show,
	closeHandler,
	className = "fixed inset-0 z-[700] p-4 sm:p-12 lg:p-20 flex items-center justify-center bg-black/75"
}: CustomModalProps) {
	if (!show) return null;
	return (
		<div onClick={closeHandler} className={className}>
			<p className="pointer-events-none absolute top-4 right-8 text-xs sm:text-sm tracking-wide text-neutral-400">
				Click to Close
			</p>
			{children}
		</div>
	);
}
interface CustomModalProps {
	children: React.ReactNode;
	show: boolean;
	closeHandler: (e: React.MouseEvent) => void;
	className?: string;
}
