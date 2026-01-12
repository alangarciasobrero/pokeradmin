-- Add position column to registrations for storing player finishing positions
ALTER TABLE `registrations`
  ADD COLUMN IF NOT EXISTS `position` INT NULL AFTER `punctuality`;

-- End of migration
