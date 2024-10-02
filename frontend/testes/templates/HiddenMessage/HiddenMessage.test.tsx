import * as React from 'react'
import { expect, test } from 'vitest'
import {render, fireEvent, screen} from '@testing-library/react'
import {HiddenMessage} from './HiddenMessage'
import {ClienteSolicitacoesMock} from '../../../src/infra/integrations/__mocks__'

test('shows the children when the checkbox is checked', () => {
	const testMessage = 'Test Message'
	render(<HiddenMessage>{ClienteSolicitacoesMock.caixas[0].id}</HiddenMessage>)
    const checkbox = screen.getByTestId('toggle') as HTMLInputElement
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
	expect(screen.findByText(ClienteSolicitacoesMock.caixas[0].id)).toBeDefined()
})
