-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Czas generowania: 21 Wrz 2021, 19:36
-- Wersja serwera: 10.4.14-MariaDB
-- Wersja PHP: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `DB_csss`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `DB_clients`
--

CREATE TABLE `DB_clients` (
  `Id` int(11) NOT NULL,
  `Mail` varchar(50) DEFAULT NULL,
  `RepairId` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `DB_clients`
--

INSERT INTO `DB_clients` (`Id`, `Mail`, `RepairId`) VALUES
(1, 'z', 'z');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `DB_users`
--

CREATE TABLE `DB_users` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) DEFAULT NULL,
  `Surname` varchar(50) DEFAULT NULL,
  `Login` varchar(50) DEFAULT NULL,
  `Pass` mediumtext DEFAULT NULL,
  `Type` enum('admin','service','medium','coordinator') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `DB_users`
--

INSERT INTO `DB_users` (`Id`, `Name`, `Surname`, `Login`, `Pass`, `Type`) VALUES
(1, 'Eryk', 'Lewandowski', 'Lewy', 'zaq1', 'admin');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `DB_clients`
--
ALTER TABLE `DB_clients`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `DB_users`
--
ALTER TABLE `DB_users`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `DB_clients`
--
ALTER TABLE `DB_clients`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT dla tabeli `DB_users`
--
ALTER TABLE `DB_users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
