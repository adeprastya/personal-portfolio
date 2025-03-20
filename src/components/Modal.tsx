/**
 * @params
 * children: the main content, show: value to show the modal, closeHandler: the function to close the modal
 *
 * @example
 * import { Modal } from "components";
 *
 * <Modal onClose={() => setOpen(false)}>
 *   <p>Main content inside the modal</p>
 * </Modal>
 */

export function Modal({
	children,
	show,
	closeHandler
}: {
	children: React.ReactNode;
	show: boolean;
	closeHandler: (e: React.MouseEvent) => void;
}) {
	if (!show) return null;
	return (
		<div onClick={closeHandler} className="fixed inset-0 z-[999] p-20 flex items-center justify-center bg-black/50">
			<p className="pointer-events-none absolute top-4 right-8 text-sm tracking-wide text-neutral-100">
				Click anywhere to close
			</p>
			{children}
		</div>
	);
}
