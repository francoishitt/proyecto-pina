-- Proyecto Piña V1.4 - ejecutar UNA VEZ en phpMyAdmin sobre la BD activa
ALTER TABLE `Categoria`
  ADD COLUMN `orden` INT NOT NULL DEFAULT 0,
  ADD COLUMN `visible` BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE `Subcategoria`
  ADD COLUMN `orden` INT NOT NULL DEFAULT 0,
  ADD COLUMN `visible` BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE `ConfiguracionWeb`
  ADD COLUMN `whatsappMensaje` TEXT NULL,
  ADD COLUMN `telefono` VARCHAR(191) NULL,
  ADD COLUMN `direccion` TEXT NULL,
  ADD COLUMN `youtube` VARCHAR(191) NULL,
  ADD COLUMN `mostrarVideosInicio` BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN `cantidadVideosInicio` INT NOT NULL DEFAULT 6;

CREATE TABLE IF NOT EXISTS `ConexionSocial` (
  `id` VARCHAR(191) NOT NULL,
  `plataforma` VARCHAR(191) NOT NULL,
  `accessToken` TEXT NOT NULL,
  `refreshToken` TEXT NULL,
  `tokenExpiresAt` DATETIME(3) NULL,
  `externalUserId` VARCHAR(191) NULL,
  `username` VARCHAR(191) NULL,
  `displayName` VARCHAR(191) NULL,
  `profileUrl` TEXT NULL,
  `avatarUrl` TEXT NULL,
  `scope` TEXT NULL,
  `connectedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ConexionSocial_plataforma_key` (`plataforma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crea configuración inicial solo si todavía no existe.
INSERT INTO `ConfiguracionWeb`
(`id`,`nombreCentro`,`tituloSitio`,`descripcionSeo`,`logoUrl`,`whatsapp`,`emailContacto`,`facebook`,`instagram`,`tiktok`,`heroTitulo`,`heroSubtitulo`,`updatedAt`,`whatsappMensaje`,`telefono`,`direccion`,`youtube`,`mostrarVideosInicio`,`cantidadVideosInicio`)
SELECT '1','Proyecto Piña','Proyecto Piña | Academia Pre-Universitaria',NULL,NULL,'51925030648','informes@proyectopina.com',NULL,NULL,NULL,'Prepárate para ingresar','Material académico y preparación preuniversitaria',NOW(),'Hola Proyecto Piña, deseo solicitar información.','+51 925 030 648','Iquitos, Loreto, Perú',NULL,TRUE,6
WHERE NOT EXISTS (SELECT 1 FROM `ConfiguracionWeb` WHERE `id`='1');
