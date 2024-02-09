import React from 'react';
import { render, screen } from '@testing-library/react';
import MyFiles from '../pages/myFiles';
import FileListItem from '../components/FileList';

jest.mock('next/router', () => require('next-router-mock'));

describe('myFiles page', () => {
    it('renders the page correctly', () => {
        render(<MyFiles />);

        expect(screen.getByText('Mes fichiers')).toBeInTheDocument();
    });
});

describe('FileListItem component', () => {
    it('renders the list of files correctly',
        () => {
            const files = [
                {id: 1, name: 'Fichier1.txt', addedDate: '2024-02-02', expirationDate: '2024-05-02', link: '/path/to/file1'},
                {id: 2, name: 'Fichier2.txt', addedDate: '2024-02-02', expirationDate: '2024-05-02', link: '/path/to/file2'},
            ];

            render(<FileListItem files={files}/>);

            expect(screen.getByText('Fichier1.txt')).toBeInTheDocument();
            expect(screen.getByText('Fichier2.txt')).toBeInTheDocument();
        });
});
